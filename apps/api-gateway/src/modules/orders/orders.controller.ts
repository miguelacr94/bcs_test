import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
  Query,
  Patch,
  Param,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { OrderPattern, ProductPattern } from '@app/shared/enums';
import { PaginationDto } from '@app/shared/dtos';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateOrderDto } from '../../../../orders/src/application/use-cases/dtos/create-order.dto';
import {
  AuthenticatedRequest,
  IOrderResponse,
  IOrderItemResponse,
  IProductResponse,
} from '@app/shared/interfaces';
import { ParseMongoIdPipe } from '@app/shared/pipes/parse-mongo-id.pipe';

@ApiTags('Órdenes')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
    private readonly logger = new Logger(OrdersController.name),
  ) {}

  @ApiOperation({ summary: 'Crear una nueva orden de compra' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado (Token no provisto o vencido)',
  })
  @Post()
  async createOrder(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateOrderDto,
  ) {
    const userId = req.user.id;
    this.logger.log(
      `Gateway: Enviando petición de creación de orden para el usuario: ${userId}`,
    );
    return await firstValueFrom(
      this.ordersClient.send(
        { cmd: OrderPattern.CREATE_ORDER },
        { userId, dto: body },
      ).pipe(timeout(5000), retry(3)),
    );
  }

  @ApiOperation({
    summary: 'Obtener el historial de órdenes del usuario autenticado',
  })
  @ApiResponse({ status: 200, description: 'Historial de órdenes obtenido' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Get('my-orders')
  async getMyOrders(
    @Request() req: AuthenticatedRequest,
    @Query() paginationDto: PaginationDto,
  ) {
    const userId = req.user.id;
    this.logger.log(
      `Gateway: Solicitando historial de órdenes para el usuario: ${userId} con paginación: ${JSON.stringify(paginationDto)}`,
    );
    return await firstValueFrom(
      this.ordersClient.send(
        { cmd: OrderPattern.GET_USER_ORDERS },
        { userId, paginationDto },
      ).pipe(timeout(5000), retry(3)),
    );
  }

  @ApiOperation({
    summary:
      'API Composer: Obtener órdenes con el detalle completo de cada producto (Paginado)',
  })
  @ApiResponse({
    status: 200,
    description: 'Órdenes y productos obtenidos exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Get('my-orders-details')
  async getMyOrdersDetails(
    @Request() req: AuthenticatedRequest,
    @Query() paginationDto: PaginationDto,
  ) {
    const userId = req.user.id;
    this.logger.log(
      `Gateway (Composer): Orquestando datos para el usuario: ${userId} con paginación: ${JSON.stringify(paginationDto)}`,
    );

    // 1. Obtener las órdenes del microservicio 'orders'
    const orders: IOrderResponse[] = await firstValueFrom(
      this.ordersClient.send(
        { cmd: OrderPattern.GET_USER_ORDERS },
        { userId, paginationDto },
      ).pipe(timeout(5000), retry(3)),
    );

    if (!orders || orders.length === 0) {
      return [];
    }

    // 2. Extraer todos los IDs de productos únicos de todas las órdenes
    const productIdsSet = new Set<string>();
    orders.forEach((order) => {
      order.items.forEach((item: IOrderItemResponse) =>
        productIdsSet.add(item.productId),
      );
    });
    const uniqueProductIds = Array.from(productIdsSet);

    // 3. Consultar los detalles de los productos al microservicio 'products' (en paralelo)
    const productsDetailsPromises = uniqueProductIds.map((id) =>
      firstValueFrom(
        this.productsClient.send(
          { cmd: ProductPattern.GET_PRODUCT_BY_ID },
          { id },
        ).pipe(timeout(5000), retry(3)),
      ).catch((err) => {
        this.logger.error(`Error obteniendo producto ${id}:`, err);
        return null; // Si falla uno, no rompemos todo
      }),
    );

    const productsArray: (IProductResponse | null)[] = await Promise.all(
      productsDetailsPromises,
    );

    // Crear un mapa (diccionario) para buscar los productos rápido por ID
    const productsMap = new Map<string, IProductResponse>();
    productsArray.forEach((p) => {
      if (p && p.id) {
        productsMap.set(p.id, p);
      }
    });

    // 4. "Componer" (Unir) los datos de las órdenes con los datos ricos de los productos
    const composedOrders = orders.map((order) => ({
      orderId: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: order.items.map((item: IOrderItemResponse) => {
        const productDetail = productsMap.get(item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.price,
          // Datos enriquecidos que vienen del microservicio de productos:
          productName: productDetail
            ? productDetail.name
            : 'Producto Desconocido',
          productDescription: productDetail ? productDetail.description : '',
        };
      }),
    }));

    // 5. Retornar el JSON unificado al cliente
    return composedOrders;
  }

  @ApiOperation({ summary: 'Cancelar una orden existente' })
  @ApiResponse({ status: 200, description: 'Orden cancelada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @Patch(':id/cancel')
  async cancelOrder(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseMongoIdPipe) orderId: string,
  ) {
    const userId = req.user.id;
    this.logger.log(
      `Gateway: Solicitando cancelación de orden: ${orderId} por el usuario: ${userId}`,
    );

    // 1. Verificación extra de seguridad: ¿Pertenece la orden al usuario?
    // Esto previene que un usuario cancele órdenes de otro (aunque la lógica de negocio de Orders también lo valida)
    const order: IOrderResponse = await firstValueFrom(
      this.ordersClient.send(
        { cmd: OrderPattern.GET_ORDER_BY_ID },
        { orderId },
      ).pipe(timeout(5000), retry(3)),
    ).catch(() => {
      throw new NotFoundException(`Orden ${orderId} no encontrada.`);
    });

    if (order.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para cancelar esta orden.',
      );
    }

    // 2. Llamar al microservicio de órdenes para ejecutar la cancelación
    // El microservicio se encargará de actualizar el estado y restaurar el stock
    return await firstValueFrom(
      this.ordersClient.send({ cmd: OrderPattern.CANCEL_ORDER }, { orderId }).pipe(timeout(5000), retry(3)),
    );
  }
}

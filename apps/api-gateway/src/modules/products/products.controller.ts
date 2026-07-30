import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role, ProductPattern } from '@app/shared/enums';
import { PaginationDto } from '@app/shared/dtos';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { CreateProductDto } from '../../../../products/src/application/use-cases/dtos/create-product.dto';
import { UpdateProductDto } from '../../../../products/src/application/use-cases/dtos/update-product.dto';
import { ParseMongoIdPipe } from '@app/shared/pipes/parse-mongo-id.pipe';

@ApiTags('Productos')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
    private readonly logger = new Logger(ProductsController.name),
  ) {}

  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, description: 'Producto creado con éxito' })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos suficientes (Solo administradores)',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createProduct(@Body() body: CreateProductDto) {
    this.logger.log(
      'Gateway: Enviando petición de creación de producto a Products por Redis...',
    );
    return await firstValueFrom(
      this.productsClient.send({ cmd: ProductPattern.CREATE_PRODUCT }, body),
    );
  }

  @ApiOperation({ summary: 'Obtener la lista de todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida' })
  @Get()
  async getAllProducts(@Query() paginationDto: PaginationDto) {
    this.logger.log(
      'Gateway: Solicitando todos los productos a Products por Redis...',
    );
    return await firstValueFrom(
      this.productsClient.send(
        { cmd: ProductPattern.GET_ALL_PRODUCTS },
        paginationDto,
      ),
    );
  }

  @ApiOperation({ summary: 'Obtener producto por categoria' })
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida' })
  @Get('category/:id')
  async getProductsByCategory(
    @Param('id', ParseMongoIdPipe) id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    this.logger.log(
      'Gateway: Solicitando todos los productos por categoria a Products por Redis...',
    );
    return await firstValueFrom(
      this.productsClient.send(
        { cmd: ProductPattern.GET_PRODUCTS_BY_CATEGORY },
        { id, paginationDto },
      ),
    );
  }

  @ApiOperation({ summary: 'Obtener el detalle de un producto por ID' })
  @ApiResponse({ status: 200, description: 'Detalle del producto retornado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @Get(':id')
  async getProductById(@Param('id', ParseMongoIdPipe) id: string) {
    this.logger.log('Gateway: Solicitando producto por ID:', id);
    return await firstValueFrom(
      this.productsClient.send(
        { cmd: ProductPattern.GET_PRODUCT_BY_ID },
        { id },
      ),
    );
  }

  @ApiOperation({ summary: 'Actualizar un producto por ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Producto actualizado con éxito' })
  @ApiResponse({ status: 403, description: 'No tienes permisos suficientes' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async updateProduct(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() body: UpdateProductDto,
  ) {
    this.logger.log(
      'Gateway: Enviando petición de actualización de producto por Redis...',
    );
    return await firstValueFrom(
      this.productsClient.send(
        { cmd: ProductPattern.UPDATE_PRODUCT },
        { id, dto: body },
      ),
    );
  }

  @ApiOperation({ summary: 'Activar un producto por ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Producto activado con éxito' })
  @ApiResponse({ status: 403, description: 'No tienes permisos suficientes' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/activate')
  async activateProduct(@Param('id', ParseMongoIdPipe) id: string) {
    this.logger.log(
      'Gateway: Enviando petición de activación de producto por Redis...',
    );
    return await firstValueFrom(
      this.productsClient.send(
        { cmd: ProductPattern.ACTIVATE_PRODUCT },
        { id },
      ),
    );
  }

  @ApiOperation({ summary: 'Eliminar un producto por ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Producto eliminado con éxito' })
  @ApiResponse({ status: 403, description: 'No tienes permisos suficientes' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteProduct(@Param('id', ParseMongoIdPipe) id: string) {
    this.logger.log(
      'Gateway: Enviando petición de eliminación de producto por Redis...',
    );
    return await firstValueFrom(
      this.productsClient.send({ cmd: ProductPattern.DELETE_PRODUCT }, { id }),
    );
  }
}

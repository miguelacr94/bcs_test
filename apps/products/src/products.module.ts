import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import {
  ProductDocument,
  ProductSchema,
} from './infrastructure/schemas/product.schema';
import { MongooseProductRepository } from './infrastructure/adapters/mongoose-product.repository';
import {
  CreateProductUseCase,
  GetAllProductsUseCase,
  GetProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
  ReduceStockUseCase,
  GetProductsByCategoryUseCase,
  ActivateProductUseCase,
} from './application/use-cases';
import { envs } from '@app/shared/config/envs';

@Module({
  imports: [
    MongooseModule.forRoot(envs.mongo.productsUri),
    MongooseModule.forFeature([
      { name: ProductDocument.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    GetAllProductsUseCase,
    GetProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    ReduceStockUseCase,
    GetProductsByCategoryUseCase,
    ActivateProductUseCase,

    // Inversión de Control: Vinculamos el Puerto de negocio con el Adaptador de Mongoose
    {
      provide: 'ProductRepositoryPort',
      useClass: MongooseProductRepository,
    },
  ],
})
export class ProductsModule {}

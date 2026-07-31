import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductsCatalogController,
  ProductsInventoryController,
} from './controllers';
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
  RestoreStockUseCase,
} from './application/use-cases';
import { envs } from '@app/shared/config/envs';

@Module({
  imports: [
    MongooseModule.forRoot(envs.mongo.productsUri),
    MongooseModule.forFeature([
      { name: ProductDocument.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ProductsCatalogController, ProductsInventoryController],
  providers: [
    CreateProductUseCase,
    GetAllProductsUseCase,
    GetProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    ReduceStockUseCase,
    GetProductsByCategoryUseCase,
    ActivateProductUseCase,
    RestoreStockUseCase,

    // Inversión de Control: Vinculamos el Puerto de negocio con el Adaptador de Mongoose
    {
      provide: 'ProductRepositoryPort',
      useClass: MongooseProductRepository,
    },
  ],
})
export class ProductsModule {}

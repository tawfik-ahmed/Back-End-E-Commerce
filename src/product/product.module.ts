import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductColor } from './entities/product-color.entity';
import { ProductImage } from './entities/product-image.entity';
import { CategoryModule } from '../category/category.module'; 
import { SubCategoryModule } from '../sub-category/sub-category.module';
import { BrandModule } from '../brand/brand.module'; 
@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductColor, ProductImage]),
    CategoryModule,
    SubCategoryModule,
    BrandModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}

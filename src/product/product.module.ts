import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entites/product.entity';
import { ProductColor } from './entites/product-color.entity';
import { ProductImage } from './entites/product-image.entity';
import { CategoryModule } from 'src/category/category.module';
import { SubCategoryModule } from 'src/sub-category/sub-category.module';
import { BrandModule } from 'src/brand/brand.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductColor, ProductImage]),
    CategoryModule,
    SubCategoryModule,
    BrandModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [],
})
export class ProductModule {}

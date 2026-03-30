import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory]), CategoryModule],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}

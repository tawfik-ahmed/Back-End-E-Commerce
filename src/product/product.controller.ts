import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

// ~api/v1/products
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  public create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  public findAll() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  public findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProduct(id);
  }

  @Patch(':id')
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  public delete(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entites/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public createProduct(createProductDto: CreateProductDto) {}

  public getAllProducts() {}

  public getProduct(id: number) {}

  public updateProduct(id: number, updateProductDto: UpdateProductDto) {}

  public deleteProduct(id: number) {}
}

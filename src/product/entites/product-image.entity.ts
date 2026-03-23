import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImage {
  @PrimaryColumn()
  url: string;

  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}

import {
  Column,
  Entity,
  ManyToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductColor {
  @PrimaryColumn()
  name: string;

  @ManyToMany(() => Product, (product) => product.colors)
  products: Product[];
}

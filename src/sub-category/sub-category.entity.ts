import { CURRENT_TIMESTAMP } from '../utils/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from 'src/category/category.entity';
import { Product } from 'src/product/entites/product.entity';

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Category, (category) => category.subCategories, {
    eager: true,
  })
  category: Category;

  @ManyToOne(() => Product, (product) => product.subCategory)
  products: Product[];

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  updatedAt: Date;
}

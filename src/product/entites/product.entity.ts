import { Category } from 'src/category/category.entity';
import { SubCategory } from 'src/sub-category/sub-category.entity';
import { Brand } from 'src/brand/brand.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductColor } from './product-color.entity';
import { ProductImage } from './product-image.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 1 })
  quantity: number;

  @Column()
  imageCover: string;

  @OneToMany(() => ProductImage, (image) => image.product, { eager: true })
  images: ProductImage[];

  @Column({ default: 0, nullable: true })
  sold: number;

  @Column({ default: 1, nullable: true })
  price: number;

  @Column({ default: 1, nullable: true })
  priceAfterDiscount: number;

  @ManyToMany(() => ProductColor, (color) => color.products, { eager: true })
  @JoinTable()
  colors: ProductColor[];

  @Column({ default: 0, nullable: true })
  averageRating: number;

  @Column({ default: 0, nullable: true })
  ratingsQuantity: number;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.products, {
    eager: true,
  })
  subCategory: SubCategory;

  @ManyToOne(() => Brand, (brand) => brand.products, { eager: true })
  brand: Brand;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  updatedAt: Date;
}

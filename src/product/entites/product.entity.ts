import { Category } from 'src/category/entites/category.entity';
import { SubCategory } from 'src/sub-category/entites/sub-category.entity';
import { Brand } from 'src/brand/entites/brand.entity';
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
import { Review } from 'src/review/entities/review.entity';

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

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @Column({ default: 0, nullable: true })
  sold: number;

  @Column({ default: 1, nullable: true })
  price: number;

  @Column({ default: 1, nullable: true })
  priceAfterDiscount: number;

  @ManyToMany(() => ProductColor, (color) => color.products)
  @JoinTable()
  colors: ProductColor[];

  @Column({ default: 0, nullable: true })
  averageRating: number;

  @Column({ default: 0, nullable: true })
  ratingsQuantity: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.products)
  subCategory: SubCategory;

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  updatedAt: Date;
}

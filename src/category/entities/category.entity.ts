import { SubCategory } from '../../sub-category/entities/sub-category.entity'; 
import { CURRENT_TIMESTAMP } from '../../utils/constants'; 
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity'; 
import { RequestProduct } from '../../request-product/entities/request-product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
  subCategories: SubCategory[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @OneToMany(() => RequestProduct, (requestProduct) => requestProduct.category)
  requestProducts: RequestProduct[];

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  updatedAt: Date;
}

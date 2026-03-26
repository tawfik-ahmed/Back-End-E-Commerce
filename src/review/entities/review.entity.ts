import { Product } from 'src/product/entites/product.entity';
import { User } from 'src/user/entites/user.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['user', 'product'])
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  reviewText: string;

  @Column({type: 'int'})
  rating: number;

  @ManyToOne(() => User, (user) => user.reviews, {onDelete: 'CASCADE'})
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews, {onDelete: 'CASCADE'})
  product: Product;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  updatedAt: Date;
}

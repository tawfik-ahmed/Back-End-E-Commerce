import { Coupon } from 'src/coupon/entities/coupon.entity';
import { User } from 'src/user/entites/user.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  totalPrice: number;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  totalPriceAfterDiscount: number;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  user: User;

  @ManyToMany(() => Coupon, (coupon) => coupon.carts)
  @JoinTable()
  coupons: Coupon[];

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items: CartItem[];

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  updatedAt: Date;
}

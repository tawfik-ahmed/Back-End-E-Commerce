import { Cart } from 'src/cart/entities/cart.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'timestamp' })
  expireDate: Date;

  @Column()
  discount: number;

  @ManyToMany(() => Cart, (cart) => cart.coupons)
  carts: Cart[];

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  updatedAt: Date;
}

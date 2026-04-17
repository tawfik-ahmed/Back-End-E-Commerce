import { Exclude } from 'class-transformer';
import { CURRENT_TIMESTAMP } from '../../utils/constants'; 
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RequestProduct } from '../../request-product/entities/request-product.entity'; 
import { UserGender, UserRole } from '../../utils/enums';
import { Review } from '../../review/entities/review.entity'; 
import { Cart } from '../../cart/entities/cart.entity'; 
import { Order } from '../../order/entities/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: true })
  age: number;

  @Column({ type: 'enum', enum: UserGender, nullable: true })
  gender: UserGender;

  @Column({ nullable: true })
  avatar: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  @Exclude()
  verificationCode: string;

  @Column({ default: false })
  @Exclude()
  isCodeVerified: boolean;

  @OneToMany(() => RequestProduct, (requestProduct) => requestProduct.user)
  requestProducts: RequestProduct[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  updatedAt: Date;
}

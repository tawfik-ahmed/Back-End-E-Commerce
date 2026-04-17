import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../product/entities/product.entity'; 
import { Order } from '../../order/entities/order.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems)
  product: Product;

  @ManyToOne(() => Order, (order) => order.cartItems)
  order: Order

  @Column({ default: 1 })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 20,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
    default: 0
  })
  price: number;
}

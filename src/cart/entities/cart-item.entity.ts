import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems)
  product: Product;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'decimal', scale: 2 })
  price: number;
}

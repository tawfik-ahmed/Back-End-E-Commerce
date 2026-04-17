import { CURRENT_TIMESTAMP } from '../../utils/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Tax {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  taxPrice: number;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  shippingPrice: number;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  updatedAt: Date;
}

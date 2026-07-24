import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CURRENT_TIMESTAMP } from '../../utils/constants';
import { RequestProductStatus } from '../../utils/enums';
import { Supplier } from '../../supplier/entities/supplier.entity';

@Entity()
export class RequestProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  details: string;

  @Column()
  quantity: number;

  @Column({ default: null })
  category: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.requestProducts)
  supplier: Supplier;

  @Column({
    type: 'enum',
    enum: RequestProductStatus,
    default: RequestProductStatus.PENDING,
  })
  status: RequestProductStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  updatedAt: Date;
}

import { Exclude } from 'class-transformer';
import { CURRENT_TIMESTAMP } from '../utils/constants';
import { UserGender, UserRole } from '../utils/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  isVerified: boolean;

  @Column({ nullable: true })
  verificationCode: string;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  updatedAt: Date;
}

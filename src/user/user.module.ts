import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController, UserMeController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { Supplier } from '../supplier/entities/supplier.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Supplier]),
    JwtModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController, UserMeController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { CheckoutCartController, OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CartModule } from '../cart/cart.module';
import { TaxModule } from '../tax/tax.module';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    CartModule,
    TaxModule,
    UserModule,
    ProductModule,
  ],
  controllers: [OrderController, CheckoutCartController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}

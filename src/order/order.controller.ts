import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Roles } from '../user/decorators/roles.decorator';
import { UserRole } from '../utils/enums';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import type { JwtPayloadType } from '../utils/types';
import { FRONTEND_URL } from '../utils/constants';

// ~ api/v1/carts/checkout
@Controller('carts/checkout')
export class CheckoutCartController {
  constructor(private readonly orderService: OrderService) {}

  // success_url: 'http://localhost:3000/checkout/success',
  // cancel_url: 'http://localhost:3000/checkout/cancel',

  @Post(':paymentMethod')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthGuard)
  public create(
    @Body() createOrderDto: CreateOrderDto,
    @Query() query: any,
    @Param('paymentMethod') paymentMethod: string,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    const { success_url = FRONTEND_URL, cancel_url = FRONTEND_URL } = query;

    const linksAfterPayment = { success_url, cancel_url };
    return this.orderService.createOrder(
      createOrderDto,
      paymentMethod,
      payload,
      linksAfterPayment,
    );
  }

  @Patch(':id')
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    
  }
}

// ~ api/v1/orders
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthGuard)
  public findMe(@CurrentUser() payload: JwtPayloadType) {
    return this.orderService.getMyOrders(payload);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getUserOrders(id);
  }
}
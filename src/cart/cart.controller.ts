import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dtos/create-cart.dto';
import { UpdateCartDto } from './dtos/update-cart.dto';
import { Roles } from '../user/decorators/roles.decorator';
import { UserRole } from '../utils/enums';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import type { JwtPayloadType } from '../utils/types';

// ~ api/v1/carts
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':productId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthGuard)
  public create(
    @Body() createCartDto: CreateCartDto,
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.cartService.createCartItem(
      createCartDto,
      productId,
      payload.id,
    );
  }

  @Patch('items/:itemId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthGuard)
  public update(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateCartDto: UpdateCartDto,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.cartService.updateCartItem(itemId, payload, updateCartDto);
  }

  @Delete('items/:itemId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthGuard)
  public delete(@Param('itemId', ParseIntPipe) itemId: number, @CurrentUser() payload: JwtPayloadType) {
    return this.cartService.deleteCartItem(itemId, payload);
  }

  @Get('me')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthGuard)
  public getMyCart(@CurrentUser() payload: JwtPayloadType) {
    return this.cartService.getCart(payload.id);
  }
  
  @Get('admin/:userId')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public getCartByAdmin(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.getCart(userId);
  }

  @Post('coupons/:couponName')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthGuard)
  public ApplyCoupons(@Param('couponName') couponName: string, @CurrentUser() payload: JwtPayloadType) {
    return this.cartService.ApplyCoupons(couponName, payload);
  }
}

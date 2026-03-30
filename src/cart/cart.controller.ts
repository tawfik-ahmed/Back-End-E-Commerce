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
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/utils/enums';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import type { JwtPayloadType } from 'src/utils/types';

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
    return this.cartService.createCartItem(createCartDto, productId, payload.id);
  }
}

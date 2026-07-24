import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { Roles } from '../user/decorators/roles.decorator';
import { UserRole } from '../utils/enums';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateRequestProductDto } from './dtos/create-request-product.dto';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import type { JwtPayloadType } from '../utils/types';
import { UpdateRequestProductDto } from './dtos/update-request-product.dto';

// ~api/v1/request-products
@Controller('request-products')
export class RequestProductController {
  constructor(private readonly requestProductService: RequestProductService) {}

  @Post()
  @Roles(UserRole.SUPPLIER)
  @UseGuards(AuthGuard)
  public create(
    @Body() createRequestProductDto: CreateRequestProductDto,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.requestProductService.createRequestProduct(
      createRequestProductDto,
      payload.id,
    );
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public findAll() {
    return this.requestProductService.getAllRequestProducts();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPPLIER)
  @UseGuards(AuthGuard)
  public findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.requestProductService.getRequestProduct(id, payload);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPPLIER)
  @UseGuards(AuthGuard)
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRequestProductDto: UpdateRequestProductDto,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.requestProductService.updateRequestProduct(
      id,
      updateRequestProductDto,
      payload,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPPLIER)
  @UseGuards(AuthGuard)
  public remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.requestProductService.deleteRequestProduct(id, payload);
  }

  @Post(':id/accept')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public acceptRequestProduct(@Param('id', ParseIntPipe) id: number) {
    return this.requestProductService.acceptRequestProduct(id);
  }
}

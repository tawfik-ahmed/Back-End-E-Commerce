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
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/utils/enums';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import type { JwtPayloadType } from 'src/utils/types';

// ~ api/v1/reviews
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthGuard)
  public create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.reviewService.createProductReview(createReviewDto, payload.id);
  }

  @Get(':productId')
  public findAll(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewService.getAllProductReviews(productId);
  }

  @Get(':productId/:userId')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public findOne(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.reviewService.getUserReviewForProduct(productId, userId);
  }

  @Patch(':productId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthGuard)
  public update(
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() payload: JwtPayloadType,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.updateProductReview(
      productId,
      payload.id,
      updateReviewDto,
    );
  }

  @Delete(':productId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthGuard)
  public delete(@Param('productId', ParseIntPipe) productId: number, @CurrentUser() payload: JwtPayloadType) {
    return this.reviewService.deleteProductReview(productId, payload);
  }
}

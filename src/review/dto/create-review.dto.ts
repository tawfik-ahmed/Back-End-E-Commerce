import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsString({ message: 'Review text must be a string' })
  @Length(3, 500, {
    message:
      'Review text must be at least 3 characters long and no more than 500',
  })
  @IsOptional()
  reviewText: string;

  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(1, { message: 'Rating must be at least 1 star' })
  @Max(5, { message: 'Rating must be at most 5 stars' })
  rating: number;

  @IsNumber({}, { message: 'User ID must be a number' })
  userId: number;

  @IsNumber({}, { message: 'Product ID must be a number' })
  productId: number;
}

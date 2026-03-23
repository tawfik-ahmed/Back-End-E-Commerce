import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'title must be a string' })
  @Length(3, 150, {
    message: 'title must be at least 3 characters long and no more than 150',
  })
  title: string;

  @IsString({ message: 'description must be a string' })
  @Min(20, { message: 'description must be at least 20 characters long' })
  description: string;

  @IsNumber({}, { message: 'price must be a number' })
  @Min(1, { message: 'price must be at least 1' })
  quantity: number;

  @IsUrl({}, { message: 'image cover must be a valid url' })
  imageCover: string;

  @IsArray({ message: 'images must be an array' })
  @IsUrl({}, { message: 'images must be an array of valid urls', each: true })
  @IsOptional()
  images: Array<string>;

  @IsNumber({}, { message: 'sold must be a number' })
  @IsOptional()
  sold: number;

  @IsNumber({}, { message: 'price must be a number' })
  @Min(1, { message: 'price must be at least 1' })
  price: number;

  @IsNumber({}, { message: 'price after discount must be a number' })
  @Min(1, { message: 'price must be at least 1' })
  priceAfterDiscount: number;

  @IsArray({ message: 'colors must be an array' })
  @IsUrl({}, { message: 'colors must be an array of strings', each: true })
  @IsOptional()
  colors: Array<string>;

  @IsNumber({}, { message: 'category Id must be a number' })
  categoryId: number;

  @IsNumber({}, { message: 'sub category Id must be a number' })
  subCategoryId: number;

  @IsNumber({}, { message: 'brand Id must be a number' })
  brandId: number;
}

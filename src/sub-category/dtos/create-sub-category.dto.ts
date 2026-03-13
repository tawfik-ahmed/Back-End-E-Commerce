import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString({ message: 'Name must be a string' })
  @Length(3, 50, {
    message: 'Name must be at least 3 characters long and no more than 50',
  })
  name: string;

  @IsString({ message: 'Image must be a string' })
  @IsUrl({}, { message: 'Image must be a valid url' })
  @IsOptional()
  image: string;

  @IsNumber({}, { message: 'Category must be a number' })
  categoryId: number;
}

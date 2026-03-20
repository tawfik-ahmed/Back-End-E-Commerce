import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateRequestProductDto {
  @IsString({ message: 'title must be a string' })
  title: string;

  @MinLength(5, { message: 'details must be at least 5 characters long' })
  @IsString({ message: 'details must be a string' })
  details: string;

  @IsNumber({}, { message: 'quantity must be a number' })
  quantity: number;

  @IsOptional()
  @IsString({ message: 'category must be a string' })
  category: string;
}

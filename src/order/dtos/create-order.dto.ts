import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  alias?: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsString()
  phone: string;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  governorate?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsString()
  street: string;
}

import { IsNumber, IsOptional } from 'class-validator';

export class CreateTaxDto {
  @IsNumber({}, { message: 'Tax price must be a number' })
  @IsOptional()
  taxPrice: number;

  @IsNumber({}, { message: 'Shipping price must be a number' })
  @IsOptional()
  shippingPrice: number;
}

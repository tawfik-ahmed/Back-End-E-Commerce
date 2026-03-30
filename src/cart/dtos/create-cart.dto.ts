import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateCartDto {
  @IsNumber({}, { message: 'quantity must be a number' })
  quantity: number = 1;
}

import { IsDateString, IsNumber, IsString, Length, Min } from 'class-validator';
import { IsFutureDate } from '../decorators/validate-date.decorator';

export class CreateCouponDto {
  @IsString({ message: 'Name must be a string' })
  @Length(3, 100, {
    message: 'Name must be at least 3 characters long and no more than 100',
  })
  name: string;

  @IsDateString({}, { message: 'Expire date must be a valid date string' })
  @IsFutureDate({ message: 'Expire date must be in the future' })
  expireDate: Date;

  @IsNumber({}, { message: 'Discount must be a number' })
  @Min(0, { message: 'Discount must be at least 0' })
  discount: number;
}

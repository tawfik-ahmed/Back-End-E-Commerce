import { Transform } from 'class-transformer';
import { IsString, IsUrl, Length } from 'class-validator';
import { normalizeText } from '../../utils/normalize';

export class CreateSupplierDto {
  @IsString()
  @Length(3, 100, {
    message:
      'Company name must be at least 3 characters long and no more than 100 characters',
  })
  @Transform(({ value }) => normalizeText(value))
  companyName: string;

  @IsString()
  @IsUrl({}, { message: 'Website must be a valid url' })
  website: string;
}

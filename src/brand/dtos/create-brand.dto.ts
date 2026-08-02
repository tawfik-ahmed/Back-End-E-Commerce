import { Transform } from 'class-transformer';
import { IsString, IsUrl, Length } from 'class-validator';
import { normalizeText } from '../../utils/normalize';

export class CreateBrandDto {
  @IsString({ message: 'Name must be a string' })
  @Length(3, 100, {
    message: 'Name must be at least 3 characters long and no more than 100',
  })
  @Transform(({ value }) => normalizeText(value))
  name: string;

  @IsString({ message: 'Image must be a string' })
  @IsUrl({}, { message: 'Image must be a valid url' })
  image: string;
}

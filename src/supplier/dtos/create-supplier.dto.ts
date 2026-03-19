import { IsString, IsUrl, Length } from 'class-validator';

export class CreateSupplierDto {
  @IsString({ message: 'Name must be a string' })
  @Length(3, 100, {
    message: 'Name must be at least 3 characters long and no more than 100',
  })
  name: string;

  @IsUrl({}, { message: 'Website must be a valid url' })
  website: string;
}

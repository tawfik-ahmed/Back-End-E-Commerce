import { IsString, IsUrl, Length } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @Length(3, 100, {
    message:
      'Company name must be at least 3 characters long and no more than 100 characters',
  })
  companyName: string;

  @IsString()
  @IsUrl({}, { message: 'Website must be a valid url' })
  website: string;
}

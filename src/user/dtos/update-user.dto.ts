import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsUrl({}, { message: 'Website must be a valid url' })
  @IsOptional()
  website?: string;
}

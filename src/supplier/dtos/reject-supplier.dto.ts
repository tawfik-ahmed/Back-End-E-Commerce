import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RejectSupplierDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  reason?: string;
}

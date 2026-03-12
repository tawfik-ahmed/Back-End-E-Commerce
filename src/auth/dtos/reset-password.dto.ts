import { IsEmail, IsString, Length, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Incorrect email' })
  @MaxLength(50, { message: 'Email must be no more than 50 characters' })
  email: string;
}

import { IsEmail, IsString, Length, MaxLength } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Incorrect email' })
  @MaxLength(50, { message: 'Email must be no more than 50 characters' })
  email: string;

  @IsString()
  @Length(6, 40, {
    message: 'Password must be at least 6 characters long and no more than 20',
  })
  password: string;
}

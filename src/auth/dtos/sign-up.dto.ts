import { IsEmail, IsString, Length, MaxLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @Length(3, 35, {
    message: 'Name must be at least 3 characters long and no more than 35',
  })
  name: string;

  @IsEmail({}, { message: 'Incorrect email' })
  @MaxLength(50, { message: 'Email must be no more than 50 characters' })
  email: string;

  @IsString()
  @Length(6, 40, {
    message: 'Password must be at least 6 characters long and no more than 20',
  })
  password: string;
}

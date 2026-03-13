import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

// ~ api/v1/auth
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  public signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('reset-password')
  public resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('verify-code')
  public verifyCode(
    @Body()
    verifyCode: {
      email: string;
      verificationCode: string;
    },
  ) {
    {
      const { email, verificationCode } = verifyCode;
      return this.authService.verifyVerificationCode(email, verificationCode);
    }
  }

  @Post('change-password')
  public changePassword(@Body() changePasswordDto: SignInDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}

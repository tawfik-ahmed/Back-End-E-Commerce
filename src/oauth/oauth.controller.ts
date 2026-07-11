import {Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OAuthService } from './ouath.service';
import { AuthGuard } from '@nestjs/passport';

// ~ api/v1/oauth
@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Get('google/sign')
  @UseGuards(AuthGuard('google'))
  public googleLogin() {
    return {};
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  public async googleLoginCallback(@Req() req: any) {
    const {profile} = req.user;

    return this.oauthService.validateUser({
      userId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      avatar: profile.photos?.[0]?.value ?? '',
    });
  }
}

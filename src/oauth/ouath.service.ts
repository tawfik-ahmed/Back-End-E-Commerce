import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/entites/user.entity';

type UserData = {
  userId: string;
  email: string;
  name: string;
  avatar: string;
};

function generateRandomPassword() {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=';
  let password = '';
  const passwordLength = Math.floor(Math.random() * (20 - 10 + 1)) + 10;

  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}

@Injectable()
export class OAuthService {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  /**
   * Validates the user data and generates a JWT token.
   * @param {UserData} userData
   * @returns {Promise<{ ok: boolean; access_token: string; refresh_token: string;  user: User }>}
   */
  public async validateUser(
    userData: UserData,
  ): Promise<{
    ok: boolean;
    access_token: string;
    refresh_token: string;
    user: User;
  }> {
    const exists = await this.userService.isExistsByEmail(userData.email);
    let user;

    if (!exists) {
      const result = await this.userService.createUser({
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        password: generateRandomPassword(),
      });

      user = result.data;
    } else {
      user = await this.userService.getUserByEmail(userData.email);
    }
    const accessToken = await this.authService.generateJwtAccessToken(user);
    const refreshToken = await this.authService.generateJwtRefreshToken(user);
    return {
      ok: true,
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  }
}

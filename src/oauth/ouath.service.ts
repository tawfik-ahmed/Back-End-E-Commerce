import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

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

  public async validateUser(userData: UserData) {
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
    const accessToken = await this.authService.generateJwtToken(user);
    return { ok: true, accessToken, user };
  }
}

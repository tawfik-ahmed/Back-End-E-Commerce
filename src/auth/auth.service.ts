import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Signs up a new user.
   *
   * @throws {BadRequestException} If a user with the same email already exists.
   *
   * @param {AuthDto} dto - User data.
   * @returns {Promise<{ ok: boolean, token: string, message: string, data: User }>} - Object with ok property, jwt token and user data.
   */
  public async signUp(
    dto: SignUpDto,
  ): Promise<{ ok: boolean; token: string; message: string; data: User }> {
    const isUserExists = await this.userService.isExistsByEmail(dto.email);

    if (isUserExists) {
      throw new BadRequestException({
        ok: false,
        message: 'User already exists',
      });
    }

    const hashedPassword = await this.generateHashedPassword(dto.password);
    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    const jwtToken = await this.generateJwtToken(user);
    return {
      ok: true,
      token: jwtToken,
      message: 'User created successfully',
      data: user,
    };
  }

  /**
   * Signs in an existing user.
   *
   * @throws {BadRequestException} If user does not exist.
   * @throws {BadRequestException} If password is incorrect.
   *
   * @param {SignInDto} dto - User data.
   * @returns {Promise<{ ok: boolean, token: string, message: string, data: User }>} - Object with ok property, jwt token and user data.
   */
  public async signIn(
    dto: SignInDto,
  ): Promise<{ ok: boolean; token: string; message: string; data: User }> {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) {
      throw new BadRequestException({ ok: false, message: 'User not found' });
    }

    const isPasswordMatch = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException({
        ok: false,
        message: 'Incorrect password',
      });
    }

    const jwtToken = await this.generateJwtToken(user);

    return {
      ok: true,
      token: jwtToken,
      message: 'User signed in successfully',
      data: user,
    };
  }

  /**
   * Generates a hashed password based on the given password and the salt.
   *
   * @param {string} password - Password to hash.
   * @returns {Promise<string>} - Hashed password.
   */
  public async generateHashedPassword(password: string): Promise<string> {
    const salt = Number(this.config.get<string>('SALT'));
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  /**
   * Generates a jwt token based on the given user data.
   *
   * @param {User} user - User data.
   * @returns {Promise<string>} - Jwt token.
   */
  public async generateJwtToken(user: User): Promise<string> {
    const payload = { id: user.id, role: user.role };
    return this.jwtService.signAsync(payload);
  }
}

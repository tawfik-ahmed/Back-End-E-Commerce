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
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
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
   * Resets the password for the given user.
   *
   * @param {ResetPasswordDto} dto - User data.
   * @returns {Promise<{ ok: boolean, message: string }>} - Object with ok property and success message.
   */
  public async resetPassword(
    dto: ResetPasswordDto,
  ): Promise<{ ok: boolean; message: string }> {
    const { email } = dto;
    const user = await this.userService.getUserByEmail(email);
    const verificationCode = this.generateVerificationCode();
    user.verificationCode = verificationCode;
    await this.userRepository.save(user);

    await this.mailerService.sendMail({
      from: `Back-End E-Commerce NestJS <${this.config.get<string>('SMTP_USER')}>`,
      to: email,
      subject: 'Back-End E-Commerce NestJS - Reset Password',
      html: `<div>
        <h1>Forgot your password? If you didn't request a password reset, you can safely ignore this email.</h1>
        <p>Verification Code: 
          <span style="font-weight: bold; font-size: 24px; color: red;">${verificationCode}</span>
        </p>
        <p>Don't share this code with anyone.</p>
        <p>Thank you for using our service!</p>
        <p>Best regards,<br/>Back-End E-Commerce NestJS</p>
      </div>`,
    });

    return {
      ok: true,
      message: `Verification code sent successfully on your email ${email}`,
    };
  }

  /**
   * Change the password for the given user.
   *
   * @param {SignInDto} dto - User data.
   * @returns {Promise<{ ok: boolean, message: string }>} - Object with ok property and success message.
   * @throws {BadRequestException} If the verification code is incorrect.
   */
  public async changePassword(
    dto: SignInDto,
  ): Promise<{ ok: boolean; message: string }> {
    const { email, password: newPassword } = dto;
    const user = await this.userService.getUserByEmail(email);

    if (!user.isCodeVerified) {
      throw new BadRequestException({
        ok: false,
        message: 'Please verify your code first',
      });
    }

    const hashedPassword = await this.generateHashedPassword(newPassword);
    user.password = hashedPassword;
    user.isCodeVerified = false;
    await this.userRepository.save(user);
    return { ok: true, message: 'Password changed successfully' };
  }

  /**
   * Verify the verification code for the given user.
   *
   * @throws {BadRequestException} If the verification code is incorrect.
   *
   * @param {string} email - Email of the user to verify.
   * @param {string} verificationCode - Verification code to verify.
   * @returns {Promise<{ ok: boolean; message: string }>} - Object with ok property and success message.
   */
  public async verifyVerificationCode(
    email: string,
    verificationCode: string,
  ): Promise<{ ok: boolean; message: string }> {
    const user = await this.userService.getUserByEmail(email);

    if (user.verificationCode !== verificationCode) {
      throw new BadRequestException({
        ok: false,
        message: 'Incorrect code',
      });
    }

    user.verificationCode = null!;
    user.isCodeVerified = true;

    await this.userRepository.save(user);
    return { ok: true, message: 'code verified successfully' };
  }

  /**
   * Generates a verification code as a string of 6 digits, between 100000 and 999999.
   * This code is used to verify the user's email address during the sign up process.
   */
  private generateVerificationCode(): string {
    return Math.floor(Math.random() * 900000 + 100000).toString();
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

import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  /**
   * Create a new user.
   *
   * @throws {BadRequestException} If user with same email already exists.
   *
   * @param {CreateUserDto} body - Request body.
   * @returns {Promise<any>} - Response object.
   */

  public async createUser(dto: CreateUserDto): Promise<any> {
    const isExists = await this.isExistsByEmail(dto.email);

    if (isExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.generateHashedPassword(dto.password);
    const user: User = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    console.log(user.password);
    await this.userRepository.save(user);

    return {
      ok: true,
      message: 'User created successfully',
      data: user,
    };
  }

  /**
   * Check if user with given email already exists.
   *
   * @param {string} email - Email to check.
   * @returns {Promise<boolean>} - True if user exists, false otherwise.
   */

  private isExistsByEmail(email: string) {
    return this.userRepository.exists({ where: { email } });
  }

  /**
   * Generates a hashed password based on the given password and the salt.
   *
   * @param {string} password - Password to hash.
   * @returns {Promise<string>} - Hashed password.
   */

  private async generateHashedPassword(password: string) {
    const salt = Number(this.config.get<string>('SALT'));
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}

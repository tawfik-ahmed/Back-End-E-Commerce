import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { getMetadataArgsStorage, Like, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserRole } from 'src/utils/enums';
import { JwtPayloadType } from 'src/utils/types';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /**
   * Create a new user.
   *
   * @param {CreateUserDto} dto - User data.
   * @returns {Promise<{ ok: boolean, message: string, data: User }>} - Object with ok property and user data.
   */
  public async createUser(
    dto: CreateUserDto,
  ): Promise<{ ok: boolean; message: string; data: User }> {
    const isExists = await this.isExistsByEmail(dto.email);

    if (isExists) {
      throw new BadRequestException({
        ok: false,
        message: 'User already exists',
      });
    }

    const hashedPassword = await this.authService.generateHashedPassword(
      dto.password,
    );

    const user = {
      ...dto,
      password: hashedPassword,
      active: true,
    };

    const newUser: User = this.userRepository.create(user);
    await this.userRepository.save(newUser);

    return {
      ok: true,
      message: 'User created successfully',
      data: newUser,
    };
  }

  /**
   * Get all users with optional query parameters.
   *
   * @param {object} query - Query parameters.
   * @param {number} query.limit - Number of users to retrieve.
   * @param {number} query.skip - Number of users to skip.
   * @param {string} query.sort - Sort by column name.
   * @param {string} query.name - Name to search for.
   * @param {string} query.email - Email to search for.
   * @param {string} query.role - Role to search for.
   * @returns {Promise<{ ok: boolean; data: User[] }>}
   */
  public async getAllUsers(query: any): Promise<{ ok: boolean; data: User[] }> {
    const { limit, skip, sort, term = 'ASC', name, email, role } = query;

    const conditions = {
      ...(name ? { name: Like(`%${name}%`) } : {}),
      ...(email ? { email: Like(`%${email}%`) } : {}),
      ...(role && role in UserRole ? { role } : {}),
    };

    let orderConditions = {};

    if (
      (sort && term.toUpperCase() === 'ASC') ||
      term.toUpperCase() === 'DESC'
    ) {
      const userColumns = getMetadataArgsStorage()
        .columns.filter((col) => col.target === User)
        .map((col) => col.propertyName);

      orderConditions = userColumns.includes(sort)
        ? { [sort]: term?.toUpperCase() }
        : {};
    }

    const users = await this.userRepository.find({
      where: conditions,
      order: orderConditions,
      skip: skip && !isNaN(skip) ? Number(skip) : 0,
      take: limit && !isNaN(limit) ? Math.min(100, Number(limit)) : 100,
    });

    return { ok: true, data: users };
  }

  /**
   * Get a user by id.
   *
   * @returns {Promise<{ ok: boolean, data: User }>} - Object with ok property and user data.
   */
  public async getUser(id: number): Promise<{ ok: boolean; data: User }> {
    const user = await this.getUserById(id);
    return { ok: true, data: user };
  }

  /**
   * Update a user by id.
   *
   * @param {number} id - User id.
   * @param {UpdateUserDto} dto - User data.
   * @returns {Promise<{ ok: boolean, data: User }>} - Object with ok property and user data.
   */
  public async updateUser(
    id: number,
    dto: UpdateUserDto,
  ): Promise<{ ok: boolean; data: User }> {
    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException({ ok: false, message: 'User not found' });
    }

    const curUser = { ...dto };

    if (dto?.password) {
      const hashedPassword = await this.authService.generateHashedPassword(
        dto.password,
      );
      curUser.password = hashedPassword;
    }

    const updatedUser = this.userRepository.merge(user, curUser);
    await this.userRepository.save(updatedUser);

    return { ok: true, data: updatedUser };
  }

  /**
   * Delete a user by id.
   *
   * @throws {NotFoundException} If user does not exist.
   *
   * @param {number} id - User id.
   * @returns {Promise<{ ok: boolean, message: string }>} - Object with ok property and success message.
   */
  public async deleteUser(
    id: number,
  ): Promise<{ ok: boolean; message: string }> {
    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException({ ok: false, message: 'User not found' });
    }

    await this.userRepository.remove(user);
    return { ok: true, message: 'User deleted successfully' };
  }

  /**
   * Get the current user based on the jwt payload.
   *
   * @returns {Promise<{ ok: boolean, data: User }>} - Object with ok property and user data.
   */
  public async getMe(
    payload: JwtPayloadType,
  ): Promise<{ ok: boolean; data: User }> {
    const user = await this.getUserById(payload.id);
    return { ok: true, data: user };
  }

  /**
   * Update the current user.
   *
   * @param {JwtPayloadType} payload - Payload of the jwt token.
   * @param {UpdateUserDto} dto - User data to update.
   * @returns {Promise<{ ok: boolean, data: User }>} - Object with ok property and user data.
   */
  public async updateMe(
    payload: JwtPayloadType,
    dto: UpdateUserDto,
  ): Promise<{ ok: boolean; data: User }> {
    const user = await this.getUserById(payload.id);
    const updatedUser = this.userRepository.merge(user, dto);
    await this.userRepository.save(updatedUser);
    return { ok: true, data: updatedUser };
  }

  /**
   * Soft delete the current user.
   *
   * This method will set the user's isActive property to false.
   *
   * @param {JwtPayloadType} payload - Payload of the jwt token.
   * @returns {Promise<{ ok: boolean, message: string }>} - Object with ok property and message.
   */
  public async deleteMe(
    payload: JwtPayloadType,
  ): Promise<{ ok: boolean; message: string }> {
    const user = await this.getUserById(payload.id);
    const updatedUser = this.userRepository.merge(user, { isActive: false });
    await this.userRepository.save(updatedUser);
    return { ok: true, message: 'User deleted successfully' };
  }

  /**
   * Get a user by id.
   *
   * @throws {NotFoundException} If user does not exist.
   *
   * @private
   *
   * @param {number} id - User id.
   * @returns {Promise<User>} - User object.
   */
  private async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException({ ok: false, message: 'User not found' });
    }

    return user;
  }

  /**
   * Retrieves a user by email.
   *
   * @throws {NotFoundException} If user does not exist.
   *
   * @param {string} email - Email of the user to retrieve.
   * @returns {Promise<User>} - User object.
   */
  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException({ ok: false, message: 'User not found' });
    }

    return user;
  }

  /**
   * Check if user with given email already exists.
   *
   * @param {string} email - Email to check.
   * @returns {Promise<boolean>} - True if user exists, false otherwise.
   */
  public isExistsByEmail(email: string): Promise<boolean> {
    return this.userRepository.exists({ where: { email } });
  }
}

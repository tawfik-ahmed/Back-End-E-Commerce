import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtPayloadType } from 'src/utils/types';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from 'src/utils/enums';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}

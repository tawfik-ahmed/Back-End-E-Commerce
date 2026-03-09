import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from 'src/utils/enums';
import { UpdateUserDto } from './dtos/update-user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('admins')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public findAll(@Query() query) {
    return this.userService.getAllUsers(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getOneUser(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}

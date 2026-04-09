import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto } from './dtos/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dtos/update-sub-category.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../user/decorators/roles.decorator'; 
import { UserRole } from '../utils/enums';

// ~ api/v1/sub-categories
@Controller('sub-categories')
export class SubCategoryController {
  constructor(private readonly SubCategoryService: SubCategoryService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public create(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.SubCategoryService.createSubCategory(createSubCategoryDto);
  }

  @Get()
  public findAll() {
    return this.SubCategoryService.getAllCategories();
  }

  @Get(':id')
  public findOne(@Param('id', ParseIntPipe) id: number) {
    return this.SubCategoryService.getSubCategory(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.SubCategoryService.updateSubCategory(id, updateSubCategoryDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public remove(@Param('id', ParseIntPipe) id: number) {
    return this.SubCategoryService.removeSubCategory(id);
  }
}

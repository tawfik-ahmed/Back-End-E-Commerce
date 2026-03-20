import { Controller, Get, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dtos/create-tax.dto';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/utils/enums';
import { AuthGuard } from 'src/auth/guards/auth.guard';

// ~ api/v1/taxes
@Controller('taxes')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public create(@Body() createTaxDto: CreateTaxDto) {
    return this.taxService.createOrUpdateTax(createTaxDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public findAll() {
    return this.taxService.getAllTaxes();
  }

  @Delete()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  public reset() {
    return this.taxService.resetTax();
  }
}

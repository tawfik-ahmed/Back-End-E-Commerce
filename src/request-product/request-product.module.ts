import { Module } from '@nestjs/common';
import { RequestProductController } from './request-product.controller';
import { RequestProductService } from './request-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestProduct } from './request-product.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([RequestProduct]), UserModule],
  controllers: [RequestProductController],
  providers: [RequestProductService],
  exports: [],
})
export class RequestProductModule {}

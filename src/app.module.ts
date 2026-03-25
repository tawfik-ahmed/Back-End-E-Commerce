import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entites/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entites/category.entity';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { BrandModule } from './brand/brand.module';
import { Brand } from './brand/entites/brand.entity';
import { CouponModule } from './coupon/coupon.module';
import { Coupon } from './coupon/entites/coupon.entity';
import { SupplierModule } from './supplier/supplier.module';
import { Supplier } from './supplier/entites/supplier.entity';
import { RequestProduct } from './request-product/entites/request-product.entity';
import { RequestProductModule } from './request-product/request-product.module';
import { TaxModule } from './tax/tax.module';
import { Tax } from './tax/entites/tax.entity';
import { ProductModule } from './product/product.module';
import { Product } from './product/entites/product.entity';
import { ProductColor } from './product/entites/product-color.entity';
import { ProductImage } from './product/entites/product-image.entity';
import { SubCategory } from './sub-category/entites/sub-category.entity';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: config.get<string>('SMTP_USER'),
            pass: config.get<string>('SMTP_PASSWORD'),
          },
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get<string>('DATABASE_USERNAME'),
        database: config.get<string>('DATABASE_NAME'),
        password: config.get<string>('DATABASE_PASSWORD'),
        entities: [
          User,
          Category,
          SubCategory,
          Brand,
          Coupon,
          Supplier,
          RequestProduct,
          Tax,
          Product,
          ProductColor,
          ProductImage,
        ],
        synchronize: true,
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    CouponModule,
    SupplierModule,
    RequestProductModule,
    TaxModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

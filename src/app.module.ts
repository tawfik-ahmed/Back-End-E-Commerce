import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CategoryModule } from './category/category.module';
import { Category } from './category/category.entity';
import { SubCategory } from './sub-category/sub-category.entity';
import { SubCategoryModule } from './sub-category/sub-category.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    CategoryModule,
    SubCategoryModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: config.get<string>('STMP_USER'),
            pass: config.get<string>('STMP_PASSWORD'),
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
        entities: [User, Category, SubCategory],
        synchronize: true,
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

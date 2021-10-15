import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import * as joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: joi.object({
        TYPEORM_DATABASE: joi.required(),
        TYPEORM_USERNAME: joi.required(),
        TYPEORM_PASSWORD: joi.required(),
        TYPEORM_HOST: joi.required(),
        TYPEORM_PORT: joi.number().default(5432),
        IS_SYNCHRONIZE: joi.required()
      })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: +process.env.TYPEORM_PORT,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      autoLoadEntities: true,
      synchronize: process.env.IS_SYNCHRONIZE === 'true'
    }),
    CoffeesModule,
    AuthModule,
    CommonModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

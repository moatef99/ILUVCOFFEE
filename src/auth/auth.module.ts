import { Module } from '@nestjs/common';
import { AuthConfig } from '../common/auth.config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthConfig, AuthService],
  controllers: [AuthController]
})
export class AuthModule {}

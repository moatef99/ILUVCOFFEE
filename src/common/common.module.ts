import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthConfig } from './auth.config';
import { AuthenticationGuard } from './guards/authentication.guard';

@Module({
  providers: [{ provide: APP_GUARD, useClass: AuthenticationGuard }, AuthConfig]
})
export class CommonModule {}

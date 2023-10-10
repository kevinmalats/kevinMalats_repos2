// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { CONSTANS } from '../constans/constans';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: CONSTANS.jwt.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    PrismaService,
    UsersService,
  ], // Include JWT strategy
  exports: [AuthService],
})
export class AuthModule {}

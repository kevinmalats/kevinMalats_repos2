// auth.controller.ts

import {
  Controller,
  Post,
  Request,
  Response,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './publicRoutes';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(@Request() req) {
    return this.authService.signIn(req.body);
  }

  @Post('register')
  async register(@Request() req, @Response() res) {
    const { username, email, password } = req.body;
    await this.authService.register(username, email, password);
    return res.status(200).json({ message: 'Register success' });
  }
}

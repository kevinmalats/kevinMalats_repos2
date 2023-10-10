// auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { isEmpty } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(user: any) {
    const { email, username, password } = user;
    console.log('email', email);
    let source_user;
    if (!isEmpty(email))
      source_user = await this.usersService.findUserByEmail(email);
    else if (!isEmpty(username)) {
      source_user = await this.usersService.findUserByUsername(username);
    }
    if (
      source_user &&
      !(await bcrypt.compare(password, source_user.password))
    ) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: source_user.id,
      email: source_user.email,
      username: source_user.username,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(username: string, email: string, password: string) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    return this.usersService.createUser(username, email, passwordHash);
  }
}

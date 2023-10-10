import { Injectable } from '@nestjs/common';
// prisma.service.ts

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async findUserByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async createUser(username: string, email: string, password: string) {
    return this.prisma.user.create({
      data: { username, email, password },
    });
  }
}

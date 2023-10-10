import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PrismaService {
  constructor() {}

  task = prisma.task;
  user = prisma.user;
}

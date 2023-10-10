import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './entitys/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTaskDto) {
    console.log('data', data);
    return this.prisma.task.create({ data });
  }

  async findAll(idUser: string) {
    const query = { where: { assignedToId: idUser } };
    return this.prisma.task.findMany(query);
  }

  async findAllByAllUsers() {
    console.log('findAllByAllUsers');
    return this.prisma.task.findMany();
  }

  async findOne(id: string, idUser: string) {
    const query = { where: { id, assignedToId: idUser } };
    return this.prisma.task.findUnique(query);
  }

  async update(
    id: string,
    data: { title?: string; description?: string },
    idUser: string,
  ) {
    const query = { where: { id, assignedToId: idUser }, data };
    return this.prisma.task.update(query);
  }

  async remove(id: string, idUser: string) {
    const query = { where: { id, assignedToId: idUser } };
    return this.prisma.task.delete(query);
  }
}

// src/websocket.module.ts

import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { TasksModule } from '../tasks/tasks.module';
import { TasksService } from '../tasks/tasks.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  providers: [WebsocketGateway, TasksService, PrismaService],
})
export class WebsocketModule {}

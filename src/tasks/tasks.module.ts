// tasks/tasks.module.ts

import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { WebsocketModule } from '../websocket/websocket.module';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Module({
  imports: [WebsocketModule],
  controllers: [TasksController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    TasksService,
    PrismaService,
    WebsocketGateway,
  ],
})
export class TasksModule {}

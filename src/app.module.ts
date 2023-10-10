// app.module.ts

import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [TasksModule, AuthModule, WebsocketModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}

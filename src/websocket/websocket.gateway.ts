// src/websocket.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TasksService } from '../tasks/tasks.service';

@WebSocketGateway()
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(private readonly taskService: TasksService) {}

  afterInit() {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('getTasks')
  handleMessage(client: Socket, payload: string): void {
    console.log(`Received message from ${client.id}: ${payload}`);
    // Broadcast the message to all connected clients
    this.taskService.findAllByAllUsers().then((tasks) => {
      this.server.emit('tasks', tasks);
    });
  }
  listenEvents() {
    console.log('listenEvents');
    this.taskService.findAllByAllUsers().then((tasks) => {
      console.log('emitiendo tareas');
      this.server.emit('tasks', tasks);
    });
  }
}

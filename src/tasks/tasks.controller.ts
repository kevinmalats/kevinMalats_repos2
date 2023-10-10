// tasks/tasks.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './entitys/create-task.dto';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly webSocketGateway: WebsocketGateway,
  ) {}

  @Get()
  findAll(@Request() req) {
    const idUser = req.user.sub;
    return this.tasksService.findAll(idUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const idUser = req.user.sub;
    return this.tasksService.findOne(id, idUser);
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    createTaskDto.assignedToId = req.user.sub;
    const response = await this.tasksService.create(createTaskDto);
    this.webSocketGateway.listenEvents();
    return response;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: CreateTaskDto,
    @Request() req,
  ) {
    const idUser = req.user.sub;
    const response = await this.tasksService.update(id, updateTaskDto, idUser);
    this.webSocketGateway.listenEvents();
    return response;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const idUser = req.user.sub;
    const response = await this.tasksService.remove(id, idUser);
    this.webSocketGateway.listenEvents();
    return response;
  }
}

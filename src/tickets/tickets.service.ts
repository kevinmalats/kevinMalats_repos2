import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import {
  CategoryEnum,
  PriorityEnum,
  Prisma,
  StatusEnum,
  Ticket,
} from '@prisma/client';
import { GetTicketsArgs } from './ticket.schema';
import { ApiFakeService } from '../gateway/api/api-fake.service';
import { KafkaService } from '../gateway/kafka/kafka.service';
import { Category } from '../enums/constans';

@Injectable()
export class TicketsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiFakeService: ApiFakeService,
    private readonly kafkaService: KafkaService,
  ) {}

  async getTicket(id: string): Promise<Ticket> {
    try {
      const ticket = await this.prisma.ticket.findUnique({ where: { id } });
      if (!ticket) {
        throw new Error('Ticket not found');
      }
      return ticket;
    } catch (error) {
      throw new Error(error);
    }
  }

  getTicketMock(): Ticket {
    return {
      id: '123',
      title: 'title',
      description: 'description',
      createdAt: new Date(),
      updatedAt: new Date(),
      category: CategoryEnum.incident,
      priority: PriorityEnum.high,
      status: StatusEnum.pending,
    };
  }

  getTickets(filters: GetTicketsArgs): Promise<Ticket[]> {
    const skip = filters.skip || 1;
    const limit =
      filters.limit === 0
        ? 10
        : filters.limit == undefined
        ? 10
        : filters.limit;
    console.log(skip);
    return this.prisma.ticket.findMany({
      skip: (skip - 1) * limit,
      take: limit,
      where: {
        priority: filters.priority,
        status: filters.status,
        category: filters.category,
        createdAt: {
          gte: filters.start,
          lte: filters.end,
        },
      },
    });
  }

  async createTicket(input: Prisma.TicketCreateInput): Promise<Ticket> {
    // console.log(input);
    const ticket = await this.createTicketInDatabase(input);
    const params =
      input.category === Category.INCIDENT ||
      input.category === Category.SUPPORT
        ? '1'
        : '3';
    const apiFake = await this.apiFakeService.callApiFake(params);
    this.publishToKafka('technical_support_tickets', {
      ticketId: ticket.id,
      apiFake,
    });

    return ticket;
  }

  private publishToKafka(topic: string, payload: any): void {
    //this.kafkaService.emit(topic, payload);
    console.log(`Publicando en el tópico ${topic}:`, payload);
  }

  async createTicketInDatabase(
    input: Prisma.TicketCreateInput,
  ): Promise<Ticket> {
    console.log(input);
    return this.prisma.ticket.create({ data: input });
  }
}

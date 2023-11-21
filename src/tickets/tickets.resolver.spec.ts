import { Test, TestingModule } from '@nestjs/testing';
import { TicketsResolver } from './tickets.resolver';
import { TicketsService } from './tickets.service';
import { GetTicketsArgs } from './ticket.schema';
import { TicketResponseDTO } from './dto/ticketResponseDTO.dto';
import { CategoryEnum, PriorityEnum, StatusEnum, Ticket } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { ApiFakeService } from '../gateway/api/api-fake.service';
import { KafkaService } from '../gateway/kafka/kafka.service';

describe('TicketsResolver', () => {
  let resolver: TicketsResolver;
  let service: TicketsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const prismaMock = {
      ticket: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };
    const apiFakeServiceMock = {
      // mock methods here
    };

    const kafkaServiceMock = {
      // mock methods here
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsResolver,
        TicketsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: ApiFakeService, useValue: apiFakeServiceMock },
        { provide: KafkaService, useValue: kafkaServiceMock },
      ],
    }).compile();

    resolver = module.get<TicketsResolver>(TicketsResolver);
    service = module.get<TicketsService>(TicketsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return an array of tickets', async () => {
    const resultTicket: Ticket[] = [
      {
        id: 'testw',
        title: 'Test Ticket',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
        category: CategoryEnum.incident,
        priority: PriorityEnum.high,
        status: StatusEnum.pending,
      },
    ];
    const result: TicketResponseDTO[] = [
      new TicketResponseDTO(resultTicket[0]),
    ];
    const filters: GetTicketsArgs = { skip: 1, limit: 10 };

    jest
      .spyOn(service, 'getTickets')
      .mockImplementation(() => Promise.resolve(resultTicket));
    const tickets = await resolver.tickets(filters);
    expect(tickets[0].id).toBe(result[0].id);
    expect(tickets[0].title).toBe(result[0].title);
    expect(service.getTickets).toHaveBeenCalled();
  });
});

import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { TicketsService } from './tickets.service';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Category } from "./../enums/constans"
import { createWriteStream } from 'fs';
import {
  Ticket,
  TicketInput,
  TicketCreateInput,
  GetTicketsArgs,
} from './ticket.schema';
import { TicketResponseDTO } from './dto/ticketResponseDTO.dto';
import { StatusEnum } from '@prisma/client';
import { join } from 'path';

@Resolver(() => TicketResponseDTO)
export class TicketsResolver {
  constructor(private readonly ticketsService: TicketsService) {}

  @Query(() => [TicketResponseDTO], { nullable: true })
  async tickets(@Args() filters: GetTicketsArgs): Promise<Ticket[]> {
    const tickets = await this.ticketsService.getTickets(filters);
    return tickets.map((ticket) => new TicketResponseDTO(ticket));
  }

  @Query(() => TicketResponseDTO, { nullable: true })
  async getTicket(@Args('id') id: string): Promise<Ticket> {
   try {
      const ticket = await this.ticketsService.getTicket(id);
      return new TicketResponseDTO(ticket);
    }
    catch (error) {
      throw new Error(error);
    }
  }

  @Mutation(() => TicketResponseDTO)
  async createTicket(@Args('input') input: TicketInput): Promise<Ticket> {
    const createInput: TicketCreateInput = {
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(), 
      status: StatusEnum.pending,
    };

    const ticket = await this.ticketsService.createTicket(createInput);
    return new TicketResponseDTO(ticket);
  }

  @Mutation(() => Boolean)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
  ): Promise<boolean> {
    const { filename, createReadStream } = await file;
    const readStream = createReadStream();
    const writeStream = createWriteStream(join(__dirname, '..', 'uploads', filename));
    readStream.pipe(writeStream);
    return new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
  }
}

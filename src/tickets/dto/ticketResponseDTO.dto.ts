import { Field, ObjectType } from '@nestjs/graphql';
import { CategoryEnum, PriorityEnum, StatusEnum, Ticket } from '@prisma/client';

@ObjectType()
export class TicketResponseDTO {
  constructor(ticket: Ticket) {
    this.id = ticket.id;
    this.title = ticket.title;
    this.description = ticket.description;
    this.createdAt = ticket.createdAt;
    this.updateAt = ticket.updatedAt;
    this.category = ticket.category;
    this.priority = ticket.priority;
    this.status = ticket.status;
  }
  @Field()
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updateAt?: Date;

  @Field()
  category: CategoryEnum;

  @Field()
  priority: PriorityEnum;

  @Field()
  status: StatusEnum;
}

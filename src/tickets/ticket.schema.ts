import { ArgsType, Field, ObjectType, InputType, Int } from '@nestjs/graphql';
import { CategoryEnum, PriorityEnum, StatusEnum } from '@prisma/client';
@ObjectType()
export class Ticket {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  category: CategoryEnum;

  @Field()
  priority: PriorityEnum;

  @Field()
  status: StatusEnum;
}

@InputType()
export class TicketInput {
  @Field()
  title: string;

  @Field()
  description?: string;

  @Field()
  category: CategoryEnum;

  @Field()
  priority: PriorityEnum;
}

@ObjectType()
export class Mutation {
  @Field(() => Ticket)
  createTicket: Ticket;
}

@InputType()
export class TicketCreateInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;

  @Field()
  category: CategoryEnum;

  @Field()
  priority: PriorityEnum;

  @Field()
  status: StatusEnum;
}

@ArgsType()
export class GetTicketsArgs {
  @Field({ nullable: true })
  priority?: PriorityEnum;

  @Field({ nullable: true })
  end?: Date;

  @Field({ nullable: true })
  start?: Date;

  @Field((type) => Int, { nullable: true })
  skip: number;

  @Field({ nullable: true })
  category?: CategoryEnum;

  @Field({ nullable: true })
  status?: StatusEnum;

  @Field((type) => Int, { nullable: true })
  limit: number;
}

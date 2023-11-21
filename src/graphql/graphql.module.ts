// graphql.module.ts

import { Module } from '@nestjs/common';
import { TicketsResolver } from '../tickets/tickets.resolver';
import { GraphQLSchema } from 'graphql';
import { PrismaService } from './../prisma/prisma.service';
import { join } from 'path';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { TicketsService } from 'src/tickets/tickets.service';
import { ApiFakeService } from 'src/gateway/api/api-fake.service';
import { KafkaService } from 'src/gateway/kafka/kafka.service';
import { GraphQLUpload } from 'graphql-upload';

@Module({
  imports: [
    NestGraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'), // Ruta al archivo de esquema GraphQL
      driver: ApolloDriver,
      uploads: {
        maxFileSize: 5000000, // 5 MB
        maxFiles: 1,
      },
      resolvers: { Upload: GraphQLUpload },
    }),
  ],
  providers: [
    TicketsResolver,
    PrismaService,
    TicketsService,
    ApiFakeService,
    KafkaService,
  ],
})
export class GraphQLModule {}

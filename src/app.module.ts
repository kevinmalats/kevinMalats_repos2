import { Module } from '@nestjs/common';
import { GraphQLModule } from './graphql/graphql.module';
import { PrismaService } from './prisma/prisma.service';
import { ApiFakeService } from './gateway/api/api-fake.service';
import { TicketsService } from './tickets/tickets.service';
import { TicketsResolver } from './tickets/tickets.resolver';
import { KafkaModule } from './gateway/kafka/kafka.module';
import { UploadController } from './uploadsFiles/upload.controller';
import { ValidationFiles } from './uploadsFiles/validation';
@Module({
  imports: [GraphQLModule, KafkaModule],
  controllers: [UploadController],
  providers: [ValidationFiles,PrismaService, TicketsService, TicketsResolver, ApiFakeService],
})
export class AppModule {}

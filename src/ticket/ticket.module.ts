import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [TicketController],
  providers: [TicketService, DatabaseService],
})
export class TicketModule {}

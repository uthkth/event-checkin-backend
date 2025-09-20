import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckinLog, CheckinLogSchema } from './checkin-log.schema';
import { TicketController } from './ticket.controller';
import { Ticket, TicketSchema } from './ticket.schema';
import { TicketService } from './ticket.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema },
      { name: CheckinLog.name, schema: CheckinLogSchema },
    ]),
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}

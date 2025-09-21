import { Body, Controller, Get, Post } from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller()
export class TicketController {
  constructor(private readonly svc: TicketService) {}

  @Get('/tickets')
  getTickets() {
    return this.svc.findAll();
  }

  @Post('/checkin')
  async checkIn(@Body() body: { ticketReferenceNumber: string; method?: 'qr' | 'manual' }) {
    return this.svc.checkInByReference(body.ticketReferenceNumber, body.method ?? 'qr');
  }

  @Get('/admin/stats')
  getStats() {
    return this.svc.stats();
  }
}

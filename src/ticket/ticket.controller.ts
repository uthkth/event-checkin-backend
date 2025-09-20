import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller()
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // POST /checkin  { ticketReferenceNumber, method?: 'qr'|'manual' }
  @Post('checkin')
  async checkIn(@Body() body: { ticketReferenceNumber: string; method?: 'qr' | 'manual' }) {
    return this.ticketService.checkIn(body.ticketReferenceNumber, body.method || 'manual');
  }

  // GET /tickets
  @Get('tickets')
  async listTickets() {
    return this.ticketService.listAll();
  }

  // GET /tickets/:ref
  @Get('tickets/:ref')
  async getTicket(@Param('ref') ref: string) {
    return this.ticketService.getOne(ref);
  }

  // GET /admin/stats
  @Get('admin/stats')
  async stats() {
    return this.ticketService.stats();
  }

  // POST /admin/seed?n=15
  @Post('admin/seed')
  async seed(@Query('n') n = '15') {
    return this.ticketService.seed(Number(n));
  }
}

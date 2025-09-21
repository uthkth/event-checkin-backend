import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TicketService {
  // Mock data for testing CORS
  private mockTickets = [
    {
      _id: '1',
      ticketReferenceNumber: 'TKT001',
      attendeeName: 'John Doe',
      attendeeEmail: 'john@example.com',
      isCheckedIn: false,
      createdAt: new Date(),
    },
    {
      _id: '2',
      ticketReferenceNumber: 'TKT002',
      attendeeName: 'Jane Smith',
      attendeeEmail: 'jane@example.com',
      isCheckedIn: true,
      createdAt: new Date(),
    },
  ];

  async findByReference(ref: string) {
    return this.mockTickets.find(ticket => ticket.ticketReferenceNumber === ref) || null;
  }

  async listAll() {
    return this.mockTickets;
  }

  async getOne(ref: string) {
    const ticket = await this.findByReference(ref);
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async checkIn(ticketReferenceNumber: string, method: 'qr' | 'manual' = 'manual') {
    const ticket = await this.findByReference(ticketReferenceNumber);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (ticket.isCheckedIn) {
      throw new ConflictException('Ticket already checked in');
    }
    
    // Mock check-in
    ticket.isCheckedIn = true;
    
    return {
      success: true,
      message: 'Checked in successfully',
      ticket,
      timestamp: new Date(),
    };
  }

  async stats() {
    const total = this.mockTickets.length;
    const checkedIn = this.mockTickets.filter(t => t.isCheckedIn).length;
    const remaining = total - checkedIn;
    
    return {
      totalTickets: total,
      checkedInCount: checkedIn,
      remainingCount: remaining,
      checkinRate: total > 0 ? (checkedIn / total) * 100 : 0,
    };
  }

  async seed(n = 15) {
    // Mock seeding - just return a message
    return {
      message: `Mock: Would have created ${n} tickets`,
      created: n,
    };
  }
}
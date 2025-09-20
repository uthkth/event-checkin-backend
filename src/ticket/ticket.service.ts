import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { CheckinLog, CheckinLogDocument } from './checkin-log.schema';
import { Ticket, TicketDocument } from './ticket.schema';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
    @InjectModel(CheckinLog.name) private logModel: Model<CheckinLogDocument>,
  ) {}

  async findByReference(ref: string) {
    return this.ticketModel.findOne({ ticketReferenceNumber: ref }).exec();
  }

  async listAll() {
    return this.ticketModel.find().sort({ createdAt: -1 }).exec();
  }

  async getOne(ref: string) {
    const ticket = await this.findByReference(ref);
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async checkIn(ticketReferenceNumber: string, method: 'qr' | 'manual' = 'manual') {
    const ticket = await this.findByReference(ticketReferenceNumber);
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.checkedIn) throw new ConflictException('Ticket already checked in');

    ticket.checkedIn = true;
    ticket.checkedInAt = new Date();
    await ticket.save();

    await this.logModel.create({ ticketReferenceNumber, method });

    return ticket;
  }

  async stats() {
    const tickets = await this.ticketModel.find().exec();

    const perType: Record<string, { total: number; checkedIn: number }> = {};
    let totalChecked = 0;

    tickets.forEach((t) => {
      perType[t.ticketType] = perType[t.ticketType] || { total: 0, checkedIn: 0 };
      perType[t.ticketType].total++;
      if (t.checkedIn) {
        perType[t.ticketType].checkedIn++;
        totalChecked++;
      }
    });

    return {
      total: tickets.length,
      checkedIn: totalChecked,
      perType,
    };
  }

  async seed(n = 15) {
    const sampleTypes = ['VIP', 'Standard', 'Student'];
    const created: TicketDocument[] = [];

    for (let i = 0; i < n; i++) {
      const ref = uuidv4();
      const type = sampleTypes[i % sampleTypes.length];
      const qr = await QRCode.toDataURL(ref); // data URL image

      const ticket = await this.ticketModel.create({
        ticketReferenceNumber: ref,
        ticketType: type,
        qrCode: qr,
        checkedIn: false,
      });
      created.push(ticket);
    }
    return created;
  }
}

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { Ticket, TicketDocument, TicketType } from './ticket.schema';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<TicketDocument>,
  ) {}

  // ====== Queries ======
  async findAll(): Promise<Ticket[]> {
    return this.ticketModel.find().sort({ createdAt: 1 }).lean().exec();
  }

  async stats() {
    const total = await this.ticketModel.estimatedDocumentCount();
    const checkedIn = await this.ticketModel.countDocuments({ checkedIn: true });

    const types: TicketType[] = ['VIP', 'Standard', 'Student'];
    const perType: Record<string, { total: number; checkedIn: number }> = {};
    for (const t of types) {
      const totalT = await this.ticketModel.countDocuments({ ticketType: t });
      const checkedT = await this.ticketModel.countDocuments({ ticketType: t, checkedIn: true });
      perType[t] = { total: totalT, checkedIn: checkedT };
    }

    // recent for dashboard table (optional)
    const recent = await this.ticketModel
      .find({ checkedIn: true, checkedInAt: { $ne: null } })
      .sort({ checkedInAt: -1 })
      .limit(10)
      .lean()
      .exec();

    return { total, checkedIn, perType, recent };
  }

  // ====== Mutations ======
  async checkInByReference(ref: string, method: 'qr' | 'manual' = 'qr'): Promise<Ticket> {
    const ticket = await this.ticketModel.findOne({ ticketReferenceNumber: ref }).exec();
    if (!ticket) throw new NotFoundException('Ticket not found');

    if (ticket.checkedIn) throw new ConflictException('Ticket already checked in');

    ticket.checkedIn = true;
    ticket.checkedInAt = new Date();
    await ticket.save();
    return ticket.toObject();
  }

  // ====== Utilities for seeding/reset ======
  async clearAll() {
    await this.ticketModel.deleteMany({});
  }

  /**
   * Seed fixed distribution (e.g., { VIP: 5, Standard: 5, Student: 5 })
   */
  async seedFixed(distribution: Partial<Record<TicketType, number>>) {
    const names = [
      'Customer1','Customer2','Customer3','Customer4','Customer5',
      'Customer6','Customer7','Customer8','Customer9','Customer10',
      'Customer11','Customer12','Customer13','Customer14','Customer15',
    ];
    const docs: Partial<Ticket>[] = [];
    const order: TicketType[] = ['VIP', 'Standard', 'Student'];

    let nameIdx = 0;
    for (const type of order) {
      const count = distribution[type] ?? 0;
      for (let i = 0; i < count; i++) {
        docs.push({
          ticketReferenceNumber: randomUUID(),
          ticketType: type,
          checkedIn: false,
          customerName: names[nameIdx++ % names.length],
        });
      }
    }
    await this.ticketModel.insertMany(docs);
    return docs.length;
  }
}

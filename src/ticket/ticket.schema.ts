import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TicketDocument = Ticket & Document;

export type TicketType = 'VIP' | 'Standard' | 'Student';

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true, unique: true })
  ticketReferenceNumber: string;

  @Prop({ required: true, enum: ['VIP', 'Standard', 'Student'] })
  ticketType: TicketType;

  @Prop({ default: false })
  checkedIn: boolean;

  @Prop({ type: Date, default: null })
  checkedInAt?: Date | null;

  @Prop({ trim: true })
  customerName?: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

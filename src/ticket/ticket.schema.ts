import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TicketDocument = Ticket & Document;

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true, unique: true })
  ticketReferenceNumber: string;

  @Prop({ required: true, enum: ['VIP', 'Standard', 'Student'] })
  ticketType: string;

  @Prop()
  qrCode: string; // data URL

  @Prop({ default: false })
  checkedIn: boolean;

  @Prop()
  checkedInAt?: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

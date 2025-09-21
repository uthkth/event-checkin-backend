import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CheckinLogDocument = CheckinLog & Document;

@Schema({ timestamps: true })
export class CheckinLog {
  @Prop({ required: true })
  ticketReferenceNumber: string;

  @Prop({ required: true, enum: ['qr', 'manual'] })
  method: 'qr' | 'manual';
}

export const CheckinLogSchema = SchemaFactory.createForClass(CheckinLog);

import { IsOptional, IsString } from 'class-validator';

export class CheckinDto {
  @IsString()
  ticketReferenceNumber: string;

  @IsOptional()
  @IsString()
  method?: 'qr' | 'manual';
}

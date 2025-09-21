import { IsIn, IsOptional, IsString } from 'class-validator';

export class CheckinDto {
  @IsString()
  ticketReferenceNumber: string;

  @IsOptional()
  @IsIn(['qr', 'manual'])
  method?: 'qr' | 'manual';
}

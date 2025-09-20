import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TicketService } from '../ticket/ticket.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const ticketService = appContext.get(TicketService);
  console.log('Seeding tickets (15)...');
  const created = await ticketService.seed(15);
  console.log(`Seed complete: created ${created.length} tickets`);
  await appContext.close();
}
bootstrap();

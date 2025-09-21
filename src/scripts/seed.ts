import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TicketService } from '../ticket/ticket.service';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const svc = app.get(TicketService);

  console.log('Resetting tickets…');
  await svc.clearAll();

  console.log('Seeding 15 tickets (5 VIP / 5 Standard / 5 Student)…');
  const created = await svc.seedFixed({ VIP: 5, Standard: 5, Student: 5 });
  console.log(`Done. Created: ${created}`);

  await app.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

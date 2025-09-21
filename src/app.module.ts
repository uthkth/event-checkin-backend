// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { TicketModule } from './ticket/ticket.module';

// small helper so TypeScript knows the env var is a string
function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(requireEnv('MONGODB_URI')),
    TicketModule,
  ],
  controllers: [AppController], // keeps "/" and "/health" working
})
export class AppModule {}

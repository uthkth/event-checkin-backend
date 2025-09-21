// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      message: 'Event Check-in API',
      try: { health: '/health', tickets: '/tickets', stats: '/admin/stats' },
      time: new Date()
    };
  }
}

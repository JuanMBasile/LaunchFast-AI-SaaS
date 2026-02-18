import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  get() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

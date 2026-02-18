import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private configService: ConfigService) {}

  @Get('health')
  @ApiOperation({ summary: 'Basic health check' })
  get() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health/ollama')
  @ApiOperation({ summary: 'Ollama connectivity check' })
  async getOllama() {
    const baseURL = this.configService.get<string>('OLLAMA_BASE_URL', 'http://localhost:11434');
    try {
      const res = await fetch(baseURL, { signal: AbortSignal.timeout(3000) });
      const ok = res.ok;
      const body = ok ? await res.json().catch(() => ({})) : {};
      return {
        status: ok ? 'ok' : 'unavailable',
        ollama: ok ? body : undefined,
        error: ok ? undefined : `Ollama responded with ${res.status}`,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ollama no alcanzable';
      return {
        status: 'unavailable',
        error: message,
      };
    }
  }
}

import { plainToInstance } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsOptional()
  @IsNumber()
  PORT?: number;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsOptional()
  @IsString()
  JWT_EXPIRATION?: string;

  @IsOptional()
  @IsString()
  JWT_REFRESH_EXPIRATION?: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_ANON_KEY!: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_SERVICE_ROLE_KEY!: string;

  @IsString()
  @IsNotEmpty()
  STRIPE_SECRET_KEY!: string;

  @IsString()
  @IsNotEmpty()
  STRIPE_WEBHOOK_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  STRIPE_PRO_PRICE_ID!: string;

  @IsOptional()
  @IsString()
  AI_PROVIDER?: string;

  @IsOptional()
  @IsString()
  GROQ_API_KEY?: string;

  @IsOptional()
  @IsString()
  GROQ_MODEL?: string;

  @IsOptional()
  @IsString()
  OLLAMA_BASE_URL?: string;

  @IsOptional()
  @IsString()
  OLLAMA_MODEL?: string;

  @IsOptional()
  @IsNumber()
  OLLAMA_TIMEOUT?: number;

  @IsOptional()
  @IsNumber()
  THROTTLE_TTL?: number;

  @IsOptional()
  @IsNumber()
  THROTTLE_LIMIT?: number;

  @IsOptional()
  @IsString()
  FRONTEND_URL?: string;
}

export function validate(config: Record<string, unknown>): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    whitelist: true,
    forbidNonWhitelisted: false,
  });

  if (errors.length > 0) {
    const messages = errors.map((e) => Object.values(e.constraints ?? {}).join(', ')).join('; ');
    throw new Error(`Environment validation failed: ${messages}`);
  }

  return validated;
}

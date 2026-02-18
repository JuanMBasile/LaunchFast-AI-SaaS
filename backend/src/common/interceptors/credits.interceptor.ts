import {
  Injectable,
  Logger,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { CreditsService } from '../../credits/credits.service';
import { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class CreditsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CreditsInterceptor.name);

  constructor(private creditsService: CreditsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    return next.handle().pipe(
      tap({
        next: () => {
          if (user) {
            this.creditsService.deductCredits(user.sub, 1).catch((err: unknown) => {
              const message = err instanceof Error ? err.message : String(err);
              const stack = err instanceof Error ? err.stack : undefined;
              this.logger.error(`Failed to deduct credits for user ${user.sub}: ${message}`, stack);
            });
          }
        },
      }),
    );
  }
}

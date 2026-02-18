import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { CreditsService } from '../../credits/credits.service';
import { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class CreditsInterceptor implements NestInterceptor {
  constructor(private creditsService: CreditsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    return next.handle().pipe(
      tap({
        next: () => {
          if (user) {
            this.creditsService.deductCredits(user.sub, 1).catch(() => {});
          }
        },
      }),
    );
  }
}

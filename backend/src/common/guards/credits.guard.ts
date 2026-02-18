import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { CreditsService } from '../../credits/credits.service';
import { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class CreditsGuard implements CanActivate {
  constructor(private creditsService: CreditsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const hasCredits = await this.creditsService.hasCredits(user.sub);

    if (!hasCredits) {
      throw new ForbiddenException(
        'No credits remaining. Upgrade to Pro for 100 credits/month.',
      );
    }

    return true;
  }
}

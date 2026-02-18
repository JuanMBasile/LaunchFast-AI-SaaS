import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreditsService } from './credits.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Credits')
@Controller('credits')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CreditsController {
  constructor(private creditsService: CreditsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user credits' })
  async getCredits(@CurrentUser() user: JwtPayload) {
    return this.creditsService.getCredits(user.sub);
  }
}

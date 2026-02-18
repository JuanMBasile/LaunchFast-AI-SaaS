import { Controller, Post, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { GenerateProposalDto } from './dto/generate-proposal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreditsGuard } from '../common/guards/credits.guard';
import { CreditsInterceptor } from '../common/interceptors/credits.interceptor';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { GenerationsService } from '../generations/generations.service';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(
    private aiService: AiService,
    private generationsService: GenerationsService,
  ) {}

  @Post('generate-proposal')
  @UseGuards(CreditsGuard)
  @UseInterceptors(CreditsInterceptor)
  @ApiOperation({ summary: 'Generate AI proposal (consumes 1 credit)' })
  async generateProposal(
    @CurrentUser() user: JwtPayload,
    @Body() dto: GenerateProposalDto,
  ) {
    const output = await this.aiService.generateProposal(dto);

    const generation = await this.generationsService.create({
      userId: user.sub,
      type: 'proposal',
      title: `Proposal for ${dto.clientName} - ${dto.projectDescription.substring(0, 50)}`,
      input: dto as any,
      output,
      creditsUsed: 1,
    });

    return {
      id: generation.id,
      output,
      creditsUsed: 1,
    };
  }
}

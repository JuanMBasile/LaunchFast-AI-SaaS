import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { CreditsModule } from '../credits/credits.module';
import { GenerationsModule } from '../generations/generations.module';

@Module({
  imports: [CreditsModule, GenerationsModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}

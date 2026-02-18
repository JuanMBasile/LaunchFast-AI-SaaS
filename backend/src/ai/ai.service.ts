import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GenerateProposalDto } from './dto/generate-proposal.dto';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private model: string;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.getOrThrow<string>('OPENAI_API_KEY'),
    });
    this.model = this.configService.get<string>('OPENAI_MODEL', 'gpt-4o');
  }

  async generateProposal(dto: GenerateProposalDto): Promise<string> {
    const systemPrompt = `You are an expert freelance proposal writer. You create professional, persuasive, and well-structured proposals that win clients. Your proposals are detailed, specific to the project, and highlight value proposition clearly.

Format the proposal in Markdown with clear sections:
- **Executive Summary**
- **Understanding of the Project**
- **Proposed Solution & Approach**
- **Scope of Work** (with deliverables)
- **Timeline & Milestones**
- **Investment** (budget breakdown)
- **Why Choose Me/Us**
- **Next Steps**

Be professional yet personable. Use the client's name. Reference specific project details. Make the budget breakdown realistic.`;

    const userPrompt = `Generate a professional freelance proposal with the following details:

**Client Name:** ${dto.clientName}
**Project Description:** ${dto.projectDescription}
**Scope:** ${dto.scope}
**Budget:** $${dto.budget.toLocaleString()}
**Timeline:** ${dto.timeline}
**My Skills/Expertise:** ${dto.skills}
${dto.additionalNotes ? `**Additional Notes:** ${dto.additionalNotes}` : ''}
**Tone:** ${dto.tone || 'Professional and confident'}
**Language:** ${dto.language || 'English'}

Generate a complete, ready-to-send proposal.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new InternalServerErrorException('AI returned empty response');
      }

      return content;
    } catch (error) {
      if (error instanceof InternalServerErrorException) throw error;
      throw new InternalServerErrorException('Failed to generate proposal. Please try again.');
    }
  }
}

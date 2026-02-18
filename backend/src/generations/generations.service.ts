import { Injectable } from '@nestjs/common';
import { GenerationRepository } from '../database/repositories/generation.repository';

interface CreateGenerationDto {
  userId: string;
  type: string;
  title: string;
  input: Record<string, any>;
  output: string;
  creditsUsed: number;
}

@Injectable()
export class GenerationsService {
  constructor(private readonly generationRepository: GenerationRepository) {}

  async create(dto: CreateGenerationDto) {
    return this.generationRepository.create({
      userId: dto.userId,
      type: dto.type,
      title: dto.title,
      input: dto.input,
      output: dto.output,
      creditsUsed: dto.creditsUsed,
    });
  }

  async findAllByUser(userId: string, page: number = 1, limit: number = 20) {
    return this.generationRepository.findAllByUser(userId, page, limit);
  }

  async findOneByUser(id: string, userId: string) {
    return this.generationRepository.findOneByUser(id, userId);
  }
}

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

export interface CreateGenerationData {
  userId: string;
  type: string;
  title: string;
  input: Record<string, any>;
  output: string;
  creditsUsed: number;
}

@Injectable()
export class GenerationRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(dto: CreateGenerationData) {
    const { data, error } = await this.supabaseService
      .getAdminClient()
      .from('generations')
      .insert({
        user_id: dto.userId,
        type: dto.type,
        title: dto.title,
        input: dto.input,
        output: dto.output,
        credits_used: dto.creditsUsed,
      })
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(`Failed to create generation: ${error.message}`);
    }

    return data;
  }

  async findAllByUser(userId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const { data, error, count } = await this.supabaseService
      .getAdminClient()
      .from('generations')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new InternalServerErrorException(`Failed to fetch generations: ${error.message}`);
    }

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  async findOneByUser(id: string, userId: string) {
    const { data, error } = await this.supabaseService
      .getAdminClient()
      .from('generations')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Generation not found');
    }

    return data;
  }
}

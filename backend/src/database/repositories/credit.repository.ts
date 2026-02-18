import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

@Injectable()
export class CreditRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findByUser(userId: string) {
    const { data, error } = await this.supabaseService
      .getAdminClient()
      .from('credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }

  async updateUsed(userId: string, used: number) {
    const { error } = await this.supabaseService
      .getAdminClient()
      .from('credits')
      .update({ used })
      .eq('user_id', userId);

    if (error) {
      throw new InternalServerErrorException(`Failed to update credits: ${error.message}`);
    }
  }

  async reset(userId: string, total: number) {
    const { error } = await this.supabaseService
      .getAdminClient()
      .from('credits')
      .update({
        total,
        used: 0,
        reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      throw new InternalServerErrorException(`Failed to reset credits: ${error.message}`);
    }
  }
}

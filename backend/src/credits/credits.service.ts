import { Injectable, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';

@Injectable()
export class CreditsService {
  constructor(private supabaseService: SupabaseService) {}

  async getCredits(userId: string) {
    const { data, error } = await this.supabaseService
      .getAdminClient()
      .from('credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return { total: 0, used: 0, remaining: 0, resetAt: null };
    }

    return {
      total: data.total,
      used: data.used,
      remaining: data.remaining,
      resetAt: data.reset_at,
    };
  }

  async hasCredits(userId: string, amount: number = 1): Promise<boolean> {
    const credits = await this.getCredits(userId);
    return credits.remaining >= amount;
  }

  async deductCredits(userId: string, amount: number = 1): Promise<void> {
    const credits = await this.getCredits(userId);

    if (credits.remaining < amount) {
      throw new ForbiddenException(
        'Insufficient credits. Please upgrade your plan or wait for monthly reset.',
      );
    }

    const { error } = await this.supabaseService
      .getAdminClient()
      .from('credits')
      .update({ used: credits.used + amount })
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to deduct credits: ${error.message}`);
    }
  }

  async resetCredits(userId: string, total: number): Promise<void> {
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
      throw new Error(`Failed to reset credits: ${error.message}`);
    }
  }

  async upgradeCredits(userId: string): Promise<void> {
    await this.resetCredits(userId, 100);
  }

  async downgradeCredits(userId: string): Promise<void> {
    await this.resetCredits(userId, 5);
  }
}

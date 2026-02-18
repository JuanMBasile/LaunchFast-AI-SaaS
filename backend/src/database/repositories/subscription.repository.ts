import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

export interface SubscriptionUpsertData {
  user_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  plan: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
}

export interface SubscriptionUpdateData {
  status?: string;
  plan?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
}

@Injectable()
export class SubscriptionRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async upsert(data: SubscriptionUpsertData) {
    const { error } = await this.supabaseService
      .getAdminClient()
      .from('subscriptions')
      .upsert(data, { onConflict: 'user_id' });

    if (error) {
      throw new InternalServerErrorException(`Failed to upsert subscription: ${error.message}`);
    }
  }

  async updateBySubscriptionId(stripeSubscriptionId: string, data: SubscriptionUpdateData) {
    const { error } = await this.supabaseService
      .getAdminClient()
      .from('subscriptions')
      .update(data)
      .eq('stripe_subscription_id', stripeSubscriptionId);

    if (error) {
      throw new InternalServerErrorException(`Failed to update subscription: ${error.message}`);
    }
  }
}

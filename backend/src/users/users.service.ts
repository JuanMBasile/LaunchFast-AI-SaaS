import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async findById(id: string) {
    const { data, error } = await this.supabaseService
      .getAdminClient()
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('User not found');
    }

    return data;
  }

  async findByEmail(email: string) {
    const { data, error } = await this.supabaseService
      .getAdminClient()
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return null;
    return data;
  }

  async findByStripeCustomerId(stripeCustomerId: string) {
    const { data, error } = await this.supabaseService
      .getAdminClient()
      .from('users')
      .select('*')
      .eq('stripe_customer_id', stripeCustomerId)
      .single();

    if (error || !data) return null;
    return data;
  }

  async updatePlan(userId: string, plan: string) {
    const { data, error } = await this.supabaseService
      .getAdminClient()
      .from('users')
      .update({ plan })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update plan: ${error.message}`);
    return data;
  }

  async updateStripeCustomerId(userId: string, stripeCustomerId: string) {
    const { data, error } = await this.supabaseService
      .getAdminClient()
      .from('users')
      .update({ stripe_customer_id: stripeCustomerId })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update Stripe customer ID: ${error.message}`);
    return data;
  }
}

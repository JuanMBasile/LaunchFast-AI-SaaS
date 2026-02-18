import { Global, Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { UserRepository } from './repositories/user.repository';
import { GenerationRepository } from './repositories/generation.repository';
import { CreditRepository } from './repositories/credit.repository';
import { SubscriptionRepository } from './repositories/subscription.repository';

@Global()
@Module({
  providers: [
    SupabaseService,
    UserRepository,
    GenerationRepository,
    CreditRepository,
    SubscriptionRepository,
  ],
  exports: [
    SupabaseService,
    UserRepository,
    GenerationRepository,
    CreditRepository,
    SubscriptionRepository,
  ],
})
export class DatabaseModule {}

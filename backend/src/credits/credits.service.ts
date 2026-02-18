import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { CreditRepository } from '../database/repositories/credit.repository';

@Injectable()
export class CreditsService {
  private readonly logger = new Logger(CreditsService.name);

  constructor(private readonly creditRepository: CreditRepository) {}

  async getCredits(userId: string) {
    const data = await this.creditRepository.findByUser(userId);

    if (!data) {
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

    await this.creditRepository.updateUsed(userId, credits.used + amount);
    this.logger.log(`Deducted ${amount} credit(s) for user ${userId}`);
  }

  async resetCredits(userId: string, total: number): Promise<void> {
    await this.creditRepository.reset(userId, total);
  }

  async upgradeCredits(userId: string): Promise<void> {
    await this.resetCredits(userId, 100);
  }

  async downgradeCredits(userId: string): Promise<void> {
    await this.resetCredits(userId, 5);
  }
}

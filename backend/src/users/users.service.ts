import { Injectable } from '@nestjs/common';
import { UserRepository } from '../database/repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findByStripeCustomerId(stripeCustomerId: string) {
    return this.userRepository.findByStripeCustomerId(stripeCustomerId);
  }

  async updatePlan(userId: string, plan: string) {
    return this.userRepository.updatePlan(userId, plan);
  }

  async updateStripeCustomerId(userId: string, stripeCustomerId: string) {
    return this.userRepository.updateStripeCustomerId(userId, stripeCustomerId);
  }
}

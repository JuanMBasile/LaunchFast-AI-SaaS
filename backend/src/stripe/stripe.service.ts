import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { UsersService } from '../users/users.service';
import { CreditsService } from '../credits/credits.service';
import { SubscriptionRepository } from '../database/repositories/subscription.repository';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private creditsService: CreditsService,
    private subscriptionRepository: SubscriptionRepository,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
    );
  }

  async createCheckoutSession(userId: string, plan: string) {
    const user = await this.usersService.findById(userId);
    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id, tenantId: user.tenant_id },
      });
      customerId = customer.id;
      await this.usersService.updateStripeCustomerId(userId, customerId);
    }

    const priceId = this.configService.getOrThrow<string>('STRIPE_PRO_PRICE_ID');
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${frontendUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${frontendUrl}/pricing?canceled=true`,
      metadata: { userId, plan },
    });

    return { url: session.url, sessionId: session.id };
  }

  async createPortalSession(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user.stripe_customer_id) {
      throw new InternalServerErrorException('No Stripe customer found');
    }

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');

    const session = await this.stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${frontendUrl}/dashboard`,
    });

    return { url: session.url };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET');

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      throw new InternalServerErrorException(`Webhook signature verification failed`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      default:
        break;
    }

    this.logger.log(`Webhook processed: ${event.type}`);
    return { received: true };
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    if (!userId) return;

    const subscription = await this.stripe.subscriptions.retrieve(session.subscription as string) as Stripe.Subscription;

    await this.subscriptionRepository.upsert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: subscription.items.data[0].price.id,
      plan: 'pro',
      status: subscription.status,
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
    });

    await this.usersService.updatePlan(userId, 'pro');
    await this.creditsService.upgradeCredits(userId);
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const user = await this.usersService.findByStripeCustomerId(customerId);
    if (!user) return;

    const plan = subscription.status === 'active' ? 'pro' : 'free';

    await this.subscriptionRepository.updateBySubscriptionId(subscription.id, {
      status: subscription.status,
      plan,
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    });

    await this.usersService.updatePlan(user.id, plan);
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const user = await this.usersService.findByStripeCustomerId(customerId);
    if (!user) return;

    await this.subscriptionRepository.updateBySubscriptionId(subscription.id, {
      status: 'canceled',
      plan: 'free',
    });

    await this.usersService.updatePlan(user.id, 'free');
    await this.creditsService.downgradeCredits(user.id);
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;
    const user = await this.usersService.findByStripeCustomerId(customerId);
    if (!user) return;

    if (user.plan === 'pro') {
      await this.creditsService.resetCredits(user.id, 100);
    }
  }
}

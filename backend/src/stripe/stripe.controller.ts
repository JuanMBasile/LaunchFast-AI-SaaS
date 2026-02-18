import { Controller, Post, Get, Body, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RawBody } from '../common/decorators/raw-body.decorator';
import { StripeService } from './stripe.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe checkout session' })
  async createCheckout(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateCheckoutDto,
  ) {
    return this.stripeService.createCheckoutSession(user.sub, dto.plan);
  }

  @Get('portal')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Stripe customer portal URL' })
  async createPortal(@CurrentUser() user: JwtPayload) {
    return this.stripeService.createPortalSession(user.sub);
  }

  @Post('webhook')
  @SkipThrottle()
  @ApiOperation({ summary: 'Stripe webhook (no auth)' })
  async handleWebhook(
    @RawBody() rawBody: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.stripeService.handleWebhook(rawBody, signature);
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async createSubscription(userId: string, plan: 'MONTHLY' | 'YEARLY') {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    let customer: Stripe.Customer;
    if (user.stripeCustomerId) {
      customer = await this.stripe.customers.retrieve(user.stripeCustomerId) as Stripe.Customer;
    } else {
      customer = await this.stripe.customers.create({ email: user.email });
      await this.prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customer.id },
      });
    }

    const priceId = plan === 'MONTHLY' ? 'price_monthly_id' : 'price_yearly_id';

    const session = await this.stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${this.config.get('FRONTEND_URL')}/payment/success`,
      cancel_url: `${this.config.get('FRONTEND_URL')}/payment/cancel`,
      metadata: { userId, plan },
    });

    return { url: session.url };
  }

  async purchaseCredits(userId: string, amount: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    let customer: Stripe.Customer;
    if (user.stripeCustomerId) {
      customer = await this.stripe.customers.retrieve(user.stripeCustomerId) as Stripe.Customer;
    } else {
      customer = await this.stripe.customers.create({ email: user.email });
      await this.prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customer.id },
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `${amount} Credits` },
          unit_amount: amount * 10,
        },
        quantity: 1,
      }],
      success_url: `${this.config.get('FRONTEND_URL')}/payment/success`,
      cancel_url: `${this.config.get('FRONTEND_URL')}/payment/cancel`,
      metadata: { userId, type: 'credits', amount: amount.toString() },
    });

    return { url: session.url };
  }

  async handleWebhook(signature: string, payload: any) {
    const webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
    const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, plan, type, amount } = session.metadata;

      if (type === 'credits') {
        await this.prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: parseInt(amount) } },
        });

        await this.prisma.payment.create({
          data: {
            userId,
            stripePaymentId: session.id,
            amount: session.amount_total,
            currency: session.currency,
            type: 'credits',
            description: `${amount} credits purchase`,
            status: 'completed',
          },
        });
      } else {
        const endsAt = new Date();
        endsAt.setMonth(endsAt.getMonth() + (plan === 'MONTHLY' ? 1 : 12));

        await this.prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionPlan: plan === 'MONTHLY' ? 'PREMIUM_MONTHLY' : 'PREMIUM_YEARLY',
            subscriptionStatus: 'ACTIVE',
            subscriptionEndsAt: endsAt,
            stripeSubscriptionId: session.subscription as string,
          },
        });

        await this.prisma.payment.create({
          data: {
            userId,
            stripePaymentId: session.id,
            amount: session.amount_total,
            currency: session.currency,
            type: 'subscription',
            description: `${plan} subscription`,
            status: 'completed',
          },
        });
      }
    }

    return { received: true };
  }
}

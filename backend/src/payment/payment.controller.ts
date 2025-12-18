import { Controller, Post, Body, Headers, RawBodyRequest, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { PaymentService } from './payment.service';
import { Request } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  createSubscription(@GetUser('id') userId: string, @Body('plan') plan: 'MONTHLY' | 'YEARLY') {
    return this.paymentService.createSubscription(userId, plan);
  }

  @Post('credits')
  @UseGuards(JwtAuthGuard)
  purchaseCredits(@GetUser('id') userId: string, @Body('amount') amount: number) {
    return this.paymentService.purchaseCredits(userId, amount);
  }

  @Post('webhook')
  @Public()
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.paymentService.handleWebhook(signature, req.rawBody);
  }
}

import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AiTutorService } from './ai-tutor.service';

@Controller('ai-tutor')
@UseGuards(JwtAuthGuard)
export class AiTutorController {
  constructor(private aiTutorService: AiTutorService) {}

  @Post('chat')
  chat(
    @GetUser('id') userId: string,
    @Body('message') message: string,
    @Body('sessionId') sessionId?: string,
  ) {
    return this.aiTutorService.chat(userId, message, sessionId);
  }

  @Post('evaluate-speaking')
  evaluateSpeaking(@GetUser('id') userId: string, @Body('transcript') transcript: string) {
    return this.aiTutorService.evaluateSpeaking(userId, transcript);
  }

  @Get('sessions')
  getSessions(@GetUser('id') userId: string) {
    return this.aiTutorService.getSessions(userId);
  }
}

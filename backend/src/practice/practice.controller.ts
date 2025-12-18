import { Controller, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { PracticeService } from './practice.service';

@Controller('practice')
@UseGuards(JwtAuthGuard)
export class PracticeController {
  constructor(private practiceService: PracticeService) {}

  @Post('queue/join')
  joinQueue(@GetUser('id') userId: string) {
    return this.practiceService.joinMatchingQueue(userId);
  }

  @Delete('queue/leave')
  leaveQueue(@GetUser('id') userId: string) {
    return this.practiceService.leaveMatchingQueue(userId);
  }

  @Post('session/:sessionId/end')
  endSession(@Param('sessionId') sessionId: string) {
    return this.practiceService.endSession(sessionId);
  }
}

import { Module } from '@nestjs/common';
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';
import { PracticeGateway } from './practice.gateway';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [PracticeController],
  providers: [PracticeService, PracticeGateway],
  exports: [PracticeService],
})
export class PracticeModule {}

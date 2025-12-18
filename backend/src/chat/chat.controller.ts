import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  getChats(@GetUser('id') userId: string) {
    return this.chatService.getChats(userId);
  }

  @Post('create/:userId')
  getOrCreateChat(@GetUser('id') user1Id: string, @Param('userId') user2Id: string) {
    return this.chatService.getOrCreateChat(user1Id, user2Id);
  }

  @Get(':chatId/messages')
  getMessages(@Param('chatId') chatId: string, @GetUser('id') userId: string) {
    return this.chatService.getMessages(chatId, userId);
  }

  @Post(':chatId/read')
  markAsRead(@Param('chatId') chatId: string, @GetUser('id') userId: string) {
    return this.chatService.markMessagesAsRead(chatId, userId);
  }
}

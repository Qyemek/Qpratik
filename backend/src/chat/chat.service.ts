import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateChat(user1Id: string, user2Id: string) {
    const [smallerId, largerId] = [user1Id, user2Id].sort();

    let chat = await this.prisma.privateChat.findUnique({
      where: { user1Id_user2Id: { user1Id: smallerId, user2Id: largerId } },
    });

    if (!chat) {
      chat = await this.prisma.privateChat.create({
        data: { user1Id: smallerId, user2Id: largerId },
      });
    }

    return chat;
  }

  async getChats(userId: string) {
    const chats = await this.prisma.privateChat.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: { select: { id: true, username: true, profilePhoto: true } },
        user2: { select: { id: true, username: true, profilePhoto: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return chats.map((chat) => ({
      ...chat,
      otherUser: chat.user1Id === userId ? chat.user2 : chat.user1,
      lastMessage: chat.messages[0] || null,
    }));
  }

  async getMessages(chatId: string, userId: string) {
    const chat = await this.prisma.privateChat.findFirst({
      where: {
        id: chatId,
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });

    if (!chat) {
      throw new Error('Chat not found');
    }

    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { id: true, username: true, profilePhoto: true } } },
    });
  }

  async sendMessage(chatId: string, senderId: string, content: string) {
    const message = await this.prisma.message.create({
      data: { chatId, senderId, content },
      include: { sender: { select: { id: true, username: true, profilePhoto: true } } },
    });

    await this.prisma.privateChat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async markMessagesAsRead(chatId: string, userId: string) {
    await this.prisma.message.updateMany({
      where: {
        chatId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });
  }
}

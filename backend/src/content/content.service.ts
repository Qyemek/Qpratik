import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LanguageLevel, ContentType } from '@prisma/client';

@Injectable()
export class ContentService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async getContents(level?: LanguageLevel, type?: ContentType) {
    return this.prisma.content.findMany({
      where: {
        ...(level && { level }),
        ...(type && { type }),
        isPublished: true,
      },
      orderBy: { order: 'asc' },
    });
  }

  async getContent(id: string) {
    const content = await this.prisma.content.findUnique({ where: { id } });
    if (!content) throw new NotFoundException('Content not found');
    return content;
  }

  async getUserProgress(userId: string, level?: LanguageLevel) {
    return this.prisma.userProgress.findMany({
      where: {
        userId,
        ...(level && { content: { level } }),
      },
      include: { content: true },
    });
  }

  async completeContent(userId: string, contentId: string) {
    const content = await this.getContent(contentId);

    const existing = await this.prisma.userProgress.findUnique({
      where: { userId_contentId: { userId, contentId } },
    });

    if (existing?.completed) {
      return existing;
    }

    const progress = await this.prisma.userProgress.upsert({
      where: { userId_contentId: { userId, contentId } },
      create: {
        userId,
        contentId,
        completed: true,
        completedAt: new Date(),
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
    });

    await this.usersService.addXP(userId, content.xpReward);
    await this.usersService.updateStreak(userId);

    await this.prisma.userStats.update({
      where: { userId },
      data: { totalLessonsCompleted: { increment: 1 } },
    });

    return progress;
  }
}

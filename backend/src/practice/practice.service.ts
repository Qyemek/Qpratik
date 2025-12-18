import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class PracticeService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async joinMatchingQueue(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    await this.redis.addToMatchingQueue(userId, user.level);
    return { message: 'Joined matching queue' };
  }

  async leaveMatchingQueue(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    await this.redis.removeFromMatchingQueue(userId, user.level);
    return { message: 'Left matching queue' };
  }

  async findMatch(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const queue = await this.redis.getMatchingQueue(user.level);

    const blockedUsers = await this.prisma.blockedUser.findMany({
      where: { blockerId: userId },
      select: { blockedId: true },
    });
    const blockedIds = blockedUsers.map((b) => b.blockedId);

    const available = queue.filter((id) => id !== userId && !blockedIds.includes(id));

    if (available.length > 0) {
      const matchId = available[Math.floor(Math.random() * available.length)];
      await this.redis.removeFromMatchingQueue(userId, user.level);
      await this.redis.removeFromMatchingQueue(matchId, user.level);

      const match = await this.prisma.user.findUnique({
        where: { id: matchId },
        select: { id: true, username: true, profilePhoto: true, level: true },
      });

      return { matched: true, user: match };
    }

    return { matched: false };
  }

  async createSession(user1Id: string, user2Id: string, type: string) {
    return this.prisma.practiceSession.create({
      data: { user1Id, user2Id, type },
    });
  }

  async endSession(sessionId: string) {
    const session = await this.prisma.practiceSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new Error('Session not found');

    const duration = Math.floor((new Date().getTime() - session.startedAt.getTime()) / 1000 / 60);

    await this.prisma.practiceSession.update({
      where: { id: sessionId },
      data: { endedAt: new Date(), duration },
    });

    await this.prisma.userStats.update({
      where: { userId: session.user1Id },
      data: {
        totalPracticeMinutes: { increment: duration },
        [type === 'video' ? 'totalVideoChats' : 'totalTextChats']: { increment: 1 },
      },
    });

    await this.prisma.userStats.update({
      where: { userId: session.user2Id },
      data: {
        totalPracticeMinutes: { increment: duration },
        [type === 'video' ? 'totalVideoChats' : 'totalTextChats']: { increment: 1 },
      },
    });

    if (type === 'video') {
      await this.prisma.user.update({
        where: { id: session.user1Id },
        data: { minutesBalance: { decrement: duration } },
      });
      await this.prisma.user.update({
        where: { id: session.user2Id },
        data: { minutesBalance: { decrement: duration } },
      });
    }

    return { duration };
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LanguageLevel } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        profilePhoto: true,
        level: true,
        xp: true,
        credits: true,
        minutesBalance: true,
        currentStreak: true,
        longestStreak: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionEndsAt: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        badges: {
          include: {
            badge: true,
          },
        },
        userStats: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        profilePhoto: data.profilePhoto,
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        profilePhoto: true,
      },
    });
  }

  async addXP(userId: string, xp: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const newXP = user.xp + xp;
    const levelThresholds = {
      A1: 0, A2: 1000, B1: 2500, B2: 5000, C1: 10000, C2: 20000,
    };

    let newLevel = user.level;
    for (const [level, threshold] of Object.entries(levelThresholds).reverse()) {
      if (newXP >= threshold) {
        newLevel = level as LanguageLevel;
        break;
      }
    }

    const levelChanged = newLevel !== user.level;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { xp: newXP, level: newLevel },
    });

    if (levelChanged) {
      await this.prisma.notification.create({
        data: {
          userId,
          type: 'LEVEL_UP',
          title: 'Level Up!',
          titleEn: 'Level Up!',
          titleTr: 'Seviye Atladın!',
          message: `Congratulations! You reached ${newLevel}`,
          messageEn: `Congratulations! You reached ${newLevel}`,
          messageTr: `Tebrikler! ${newLevel} seviyesine ulaştın`,
        },
      });
    }

    return { user: updatedUser, levelChanged };
  }

  async updateStreak(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastStreak = user.lastStreakDate ? new Date(user.lastStreakDate) : null;
    if (lastStreak) {
      lastStreak.setHours(0, 0, 0, 0);
    }

    let newStreak = user.currentStreak;

    if (!lastStreak || lastStreak.getTime() < today.getTime() - 86400000) {
      if (lastStreak && lastStreak.getTime() === today.getTime() - 86400000) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      const longestStreak = Math.max(user.longestStreak, newStreak);

      return this.prisma.user.update({
        where: { id: userId },
        data: {
          currentStreak: newStreak,
          longestStreak,
          lastStreakDate: today,
        },
      });
    }

    return user;
  }

  async searchUsers(query: string, currentUserId: string) {
    return this.prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } },
          { isBanned: false },
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        profilePhoto: true,
        level: true,
      },
      take: 20,
    });
  }

  async getLeaderboard(level?: LanguageLevel) {
    return this.prisma.user.findMany({
      where: level ? { level } : {},
      orderBy: { xp: 'desc' },
      take: 100,
      select: {
        id: true,
        username: true,
        profilePhoto: true,
        level: true,
        xp: true,
        badges: {
          include: {
            badge: true,
          },
        },
      },
    });
  }

  async blockUser(userId: string, blockedUserId: string) {
    return this.prisma.blockedUser.create({
      data: { blockerId: userId, blockedId: blockedUserId },
    });
  }

  async unblockUser(userId: string, blockedUserId: string) {
    return this.prisma.blockedUser.deleteMany({
      where: { blockerId: userId, blockedId: blockedUserId },
    });
  }

  async getBlockedUsers(userId: string) {
    const blocked = await this.prisma.blockedUser.findMany({
      where: { blockerId: userId },
      include: {
        blocked: {
          select: {
            id: true,
            username: true,
            profilePhoto: true,
          },
        },
      },
    });
    return blocked.map((b) => b.blocked);
  }
}

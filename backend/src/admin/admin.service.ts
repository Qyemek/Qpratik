import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalContent, totalTests, totalPayments, activeSubscriptions] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.content.count(),
      this.prisma.test.count(),
      this.prisma.payment.count({ where: { status: 'completed' } }),
      this.prisma.user.count({ where: { subscriptionStatus: 'ACTIVE' } }),
    ]);

    const revenueResult = await this.prisma.payment.aggregate({
      where: { status: 'completed' },
      _sum: { amount: true },
    });

    return {
      totalUsers,
      totalContent,
      totalTests,
      totalPayments,
      activeSubscriptions,
      totalRevenue: revenueResult._sum.amount || 0,
    };
  }

  async getUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          level: true,
          xp: true,
          subscriptionPlan: true,
          isBanned: true,
          isMuted: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return { users, total, page, limit };
  }

  async banUser(adminId: string, userId: string, reason: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: true },
    });

    await this.prisma.adminAction.create({
      data: {
        adminId,
        action: 'BAN_USER',
        targetType: 'USER',
        targetId: userId,
        description: reason,
      },
    });

    return { message: 'User banned successfully' };
  }

  async unbanUser(adminId: string, userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: false },
    });

    await this.prisma.adminAction.create({
      data: {
        adminId,
        action: 'UNBAN_USER',
        targetType: 'USER',
        targetId: userId,
      },
    });

    return { message: 'User unbanned successfully' };
  }

  async getReports(status?: string) {
    return this.prisma.report.findMany({
      where: status ? { status: status as any } : {},
      include: {
        reporter: { select: { id: true, username: true } },
        reportedUser: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateReport(adminId: string, reportId: string, status: string, note: string) {
    await this.prisma.report.update({
      where: { id: reportId },
      data: {
        status: status as any,
        reviewedBy: adminId,
        reviewNote: note,
      },
    });

    return { message: 'Report updated successfully' };
  }

  async createContent(data: any) {
    return this.prisma.content.create({ data });
  }

  async updateContent(id: string, data: any) {
    return this.prisma.content.update({ where: { id }, data });
  }

  async deleteContent(id: string) {
    return this.prisma.content.delete({ where: { id } });
  }
}

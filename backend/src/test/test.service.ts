import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LanguageLevel } from '@prisma/client';

@Injectable()
export class TestService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async getTests(level?: LanguageLevel) {
    return this.prisma.test.findMany({
      where: {
        ...(level && { level }),
        isPublished: true,
      },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });
  }

  async getTest(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            type: true,
            question: true,
            questionEn: true,
            questionTr: true,
            options: true,
            audioUrl: true,
            points: true,
            order: true,
          },
        },
      },
    });
    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  async submitTest(userId: string, testId: string, answers: Record<string, string>) {
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
      include: { questions: true },
    });
    if (!test) throw new NotFoundException('Test not found');

    let correctAnswers = 0;
    let totalPoints = 0;
    const results = {};

    for (const question of test.questions) {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers += question.points;
      results[question.id] = { userAnswer, correct: isCorrect };
    }

    const score = Math.round((correctAnswers / totalPoints) * 100);
    const passed = score >= test.passingScore;

    const testResult = await this.prisma.testResult.create({
      data: {
        userId,
        testId,
        score,
        totalPoints,
        passed,
        answers: results,
      },
    });

    if (passed) {
      const xpReward = test.level === 'A1' ? 50 : test.level === 'A2' ? 100 : test.level === 'B1' ? 150 : test.level === 'B2' ? 200 : 250;
      await this.usersService.addXP(userId, xpReward);
    }

    await this.prisma.userStats.update({
      where: { userId },
      data: {
        totalTestsTaken: { increment: 1 },
        averageTestScore: {
          set: await this.calculateAverageScore(userId),
        },
      },
    });

    return { ...testResult, passed };
  }

  private async calculateAverageScore(userId: string): Promise<number> {
    const results = await this.prisma.testResult.findMany({
      where: { userId },
      select: { score: true },
    });
    if (results.length === 0) return 0;
    const sum = results.reduce((acc, r) => acc + r.score, 0);
    return Math.round(sum / results.length);
  }

  async getUserTestResults(userId: string) {
    return this.prisma.testResult.findMany({
      where: { userId },
      include: { test: true },
      orderBy: { completedAt: 'desc' },
    });
  }
}

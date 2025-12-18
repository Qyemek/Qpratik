import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import OpenAI from 'openai';

@Injectable()
export class AiTutorService {
  private openai: OpenAI;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.config.get('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async chat(userId: string, message: string, sessionId?: string) {
    if (!this.openai) {
      throw new BadRequestException('AI service not configured');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    let session;
    let messages = [];

    if (sessionId) {
      session = await this.prisma.aITutorSession.findUnique({ where: { id: sessionId } });
      if (session) {
        messages = session.messages as any[];
      }
    }

    messages.push({ role: 'user', content: message });

    const systemPrompt = `You are an English tutor helping a ${user.level} level student. Provide helpful corrections and explanations. Keep responses concise and educational.`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    });

    const aiMessage = completion.choices[0].message.content;
    messages.push({ role: 'assistant', content: aiMessage });

    if (session) {
      await this.prisma.aITutorSession.update({
        where: { id: sessionId },
        data: { messages },
      });
    } else {
      session = await this.prisma.aITutorSession.create({
        data: {
          userId,
          messages,
        },
      });
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { minutesBalance: { decrement: 1 } },
    });

    await this.prisma.userStats.update({
      where: { userId },
      data: { totalAIChats: { increment: 1 } },
    });

    return { message: aiMessage, sessionId: session.id };
  }

  async evaluateSpeaking(userId: string, transcript: string) {
    if (!this.openai) {
      throw new BadRequestException('AI service not configured');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an English speaking evaluator. Analyze the following transcript for a ${user.level} level student. Provide:
1. A score from 0-100
2. Grammar feedback
3. Vocabulary usage feedback
4. Fluency feedback
5. Overall suggestions

Format your response as JSON: { "score": number, "grammar": string, "vocabulary": string, "fluency": string, "suggestions": string }`,
        },
        { role: 'user', content: transcript },
      ],
    });

    const evaluation = JSON.parse(completion.choices[0].message.content);

    const session = await this.prisma.aITutorSession.create({
      data: {
        userId,
        messages: [{ transcript, evaluation }],
        speakingScore: evaluation.score,
        feedback: JSON.stringify(evaluation),
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { minutesBalance: { decrement: 2 } },
    });

    const userStats = await this.prisma.userStats.findUnique({ where: { userId } });
    const newAverage =
      (userStats.averageSpeakingScore * userStats.totalAIChats + evaluation.score) /
      (userStats.totalAIChats + 1);

    await this.prisma.userStats.update({
      where: { userId },
      data: {
        averageSpeakingScore: newAverage,
        totalAIChats: { increment: 1 },
      },
    });

    return { ...evaluation, sessionId: session.id };
  }

  async getSessions(userId: string) {
    return this.prisma.aITutorSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}

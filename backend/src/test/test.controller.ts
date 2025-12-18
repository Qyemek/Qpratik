import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { TestService } from './test.service';
import { CertificateService } from './certificate.service';

@Controller('tests')
@UseGuards(JwtAuthGuard)
export class TestController {
  constructor(
    private testService: TestService,
    private certificateService: CertificateService,
  ) {}

  @Get()
  getTests(@Query('level') level?: string) {
    return this.testService.getTests(level as any);
  }

  @Get('results')
  getUserTestResults(@GetUser('id') userId: string) {
    return this.testService.getUserTestResults(userId);
  }

  @Get(':id')
  getTest(@Param('id') id: string) {
    return this.testService.getTest(id);
  }

  @Post(':id/submit')
  async submitTest(
    @GetUser('id') userId: string,
    @Param('id') testId: string,
    @Body('answers') answers: Record<string, string>,
  ) {
    const result = await this.testService.submitTest(userId, testId, answers);

    if (result.passed && result.score >= 80) {
      const user = await this.testService['prisma'].user.findUnique({ where: { id: userId } });
      const test = await this.testService['prisma'].test.findUnique({ where: { id: testId } });
      const certificateUrl = await this.certificateService.generateCertificate(
        `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
        test.level,
        result.score,
      );
      return { ...result, certificateUrl };
    }

    return result;
  }
}

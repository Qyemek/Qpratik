import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ContentService } from './content.service';

@Controller('content')
@UseGuards(JwtAuthGuard)
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get()
  getContents(@Query('level') level?: string, @Query('type') type?: string) {
    return this.contentService.getContents(level as any, type as any);
  }

  @Get('progress')
  getUserProgress(@GetUser('id') userId: string, @Query('level') level?: string) {
    return this.contentService.getUserProgress(userId, level as any);
  }

  @Get(':id')
  getContent(@Param('id') id: string) {
    return this.contentService.getContent(id);
  }

  @Post(':id/complete')
  completeContent(@GetUser('id') userId: string, @Param('id') contentId: string) {
    return this.contentService.completeContent(userId, contentId);
  }
}

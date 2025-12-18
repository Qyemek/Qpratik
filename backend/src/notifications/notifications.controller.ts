import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  getNotifications(@GetUser('id') userId: string) {
    return this.notificationsService.getNotifications(userId);
  }

  @Get('unread-count')
  getUnreadCount(@GetUser('id') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Patch(':id/read')
  markAsRead(@GetUser('id') userId: string, @Param('id') notificationId: string) {
    return this.notificationsService.markAsRead(notificationId, userId);
  }

  @Patch('read-all')
  markAllAsRead(@GetUser('id') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }
}

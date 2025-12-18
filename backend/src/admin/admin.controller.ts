import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  getUsers(@Query('page') page: string, @Query('limit') limit: string) {
    return this.adminService.getUsers(parseInt(page) || 1, parseInt(limit) || 20);
  }

  @Post('users/:userId/ban')
  banUser(@GetUser('id') adminId: string, @Param('userId') userId: string, @Body('reason') reason: string) {
    return this.adminService.banUser(adminId, userId, reason);
  }

  @Post('users/:userId/unban')
  unbanUser(@GetUser('id') adminId: string, @Param('userId') userId: string) {
    return this.adminService.unbanUser(adminId, userId);
  }

  @Get('reports')
  getReports(@Query('status') status?: string) {
    return this.adminService.getReports(status);
  }

  @Put('reports/:reportId')
  updateReport(
    @GetUser('id') adminId: string,
    @Param('reportId') reportId: string,
    @Body('status') status: string,
    @Body('note') note: string,
  ) {
    return this.adminService.updateReport(adminId, reportId, status, note);
  }

  @Post('content')
  createContent(@Body() data: any) {
    return this.adminService.createContent(data);
  }

  @Put('content/:id')
  updateContent(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateContent(id, data);
  }

  @Delete('content/:id')
  deleteContent(@Param('id') id: string) {
    return this.adminService.deleteContent(id);
  }
}

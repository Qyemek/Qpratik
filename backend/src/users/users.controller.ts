import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getProfile(@GetUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Put('me')
  updateProfile(@GetUser('id') userId: string, @Body() data: any) {
    return this.usersService.updateProfile(userId, data);
  }

  @Get('search')
  searchUsers(@Query('q') query: string, @GetUser('id') userId: string) {
    return this.usersService.searchUsers(query, userId);
  }

  @Get('leaderboard')
  getLeaderboard(@Query('level') level?: string) {
    return this.usersService.getLeaderboard(level as any);
  }

  @Post('block/:userId')
  blockUser(@GetUser('id') currentUserId: string, @Param('userId') userId: string) {
    return this.usersService.blockUser(currentUserId, userId);
  }

  @Delete('block/:userId')
  unblockUser(@GetUser('id') currentUserId: string, @Param('userId') userId: string) {
    return this.usersService.unblockUser(currentUserId, userId);
  }

  @Get('blocked')
  getBlockedUsers(@GetUser('id') userId: string) {
    return this.usersService.getBlockedUsers(userId);
  }
}

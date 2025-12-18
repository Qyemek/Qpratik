import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { FriendsService } from './friends.service';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Get()
  getFriends(@GetUser('id') userId: string) {
    return this.friendsService.getFriends(userId);
  }

  @Get('requests')
  getPendingRequests(@GetUser('id') userId: string) {
    return this.friendsService.getPendingRequests(userId);
  }

  @Post('request/:userId')
  sendFriendRequest(@GetUser('id') senderId: string, @Param('userId') receiverId: string) {
    return this.friendsService.sendFriendRequest(senderId, receiverId);
  }

  @Post('accept/:requestId')
  acceptFriendRequest(@GetUser('id') userId: string, @Param('requestId') requestId: string) {
    return this.friendsService.acceptFriendRequest(requestId, userId);
  }

  @Delete('reject/:requestId')
  rejectFriendRequest(@GetUser('id') userId: string, @Param('requestId') requestId: string) {
    return this.friendsService.rejectFriendRequest(requestId, userId);
  }

  @Delete(':friendId')
  removeFriend(@GetUser('id') userId: string, @Param('friendId') friendId: string) {
    return this.friendsService.removeFriend(userId, friendId);
  }
}

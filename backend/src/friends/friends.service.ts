import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FriendsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async sendFriendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    const existing = await this.prisma.friendRequest.findUnique({
      where: { senderId_receiverId: { senderId, receiverId } },
    });

    if (existing) {
      throw new BadRequestException('Friend request already sent');
    }

    const alreadyFriends = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId },
        ],
      },
    });

    if (alreadyFriends) {
      throw new BadRequestException('Already friends');
    }

    const request = await this.prisma.friendRequest.create({
      data: { senderId, receiverId, status: 'pending' },
      include: { sender: { select: { id: true, username: true, profilePhoto: true } } },
    });

    await this.notificationsService.createNotification({
      userId: receiverId,
      type: 'FRIEND_REQUEST',
      titleEn: 'New Friend Request',
      titleTr: 'Yeni Arkadaşlık İsteği',
      messageEn: `${request.sender.username} sent you a friend request`,
      messageTr: `${request.sender.username} sana arkadaşlık isteği gönderdi`,
      data: { requestId: request.id, senderId },
    });

    return request;
  }

  async acceptFriendRequest(requestId: string, userId: string) {
    const request = await this.prisma.friendRequest.findUnique({ where: { id: requestId } });
    if (!request || request.receiverId !== userId) {
      throw new NotFoundException('Friend request not found');
    }

    await this.prisma.friendship.create({
      data: {
        user1Id: request.senderId,
        user2Id: request.receiverId,
      },
    });

    await this.prisma.friendRequest.delete({ where: { id: requestId } });

    await this.notificationsService.createNotification({
      userId: request.senderId,
      type: 'FRIEND_ACCEPTED',
      titleEn: 'Friend Request Accepted',
      titleTr: 'Arkadaşlık İsteği Kabul Edildi',
      messageEn: 'Your friend request was accepted',
      messageTr: 'Arkadaşlık isteğin kabul edildi',
    });

    return { message: 'Friend request accepted' };
  }

  async rejectFriendRequest(requestId: string, userId: string) {
    const request = await this.prisma.friendRequest.findUnique({ where: { id: requestId } });
    if (!request || request.receiverId !== userId) {
      throw new NotFoundException('Friend request not found');
    }

    await this.prisma.friendRequest.delete({ where: { id: requestId } });
    return { message: 'Friend request rejected' };
  }

  async getFriends(userId: string) {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: { select: { id: true, username: true, profilePhoto: true, level: true, lastActive: true } },
        user2: { select: { id: true, username: true, profilePhoto: true, level: true, lastActive: true } },
      },
    });

    return friendships.map((f) => (f.user1Id === userId ? f.user2 : f.user1));
  }

  async getPendingRequests(userId: string) {
    return this.prisma.friendRequest.findMany({
      where: { receiverId: userId, status: 'pending' },
      include: { sender: { select: { id: true, username: true, profilePhoto: true, level: true } } },
    });
  }

  async removeFriend(userId: string, friendId: string) {
    await this.prisma.friendship.deleteMany({
      where: {
        OR: [
          { user1Id: userId, user2Id: friendId },
          { user1Id: friendId, user2Id: userId },
        ],
      },
    });
    return { message: 'Friend removed' };
  }
}

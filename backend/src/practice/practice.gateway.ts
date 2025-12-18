import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PracticeService } from './practice.service';
import { RedisService } from '../redis/redis.service';
import { ChatService } from '../chat/chat.service';

@WebSocketGateway({ cors: true, namespace: '/practice' })
export class PracticeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private practiceService: PracticeService,
    private redis: RedisService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      await this.redis.setUserOnline(userId);
      client.join(`user:${userId}`);
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      await this.redis.setUserOffline(userId);
    }
  }

  @SubscribeMessage('find-match')
  async findMatch(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const result = await this.practiceService.findMatch(data.userId);
    if (result.matched) {
      const session = await this.practiceService.createSession(data.userId, result.user.id, 'text');
      this.server.to(`user:${result.user.id}`).emit('match-found', {
        sessionId: session.id,
        user: { id: data.userId },
      });
      client.emit('match-found', { sessionId: session.id, user: result.user });
    } else {
      client.emit('match-not-found');
    }
  }

  @SubscribeMessage('chat-message')
  async handleChatMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { chatId, senderId, content, recipientId } = data;
    const message = await this.chatService.sendMessage(chatId, senderId, content);
    this.server.to(`user:${recipientId}`).emit('chat-message', message);
    client.emit('chat-message', message);
  }

  @SubscribeMessage('webrtc-offer')
  handleOffer(@MessageBody() data: any) {
    this.server.to(`user:${data.to}`).emit('webrtc-offer', data);
  }

  @SubscribeMessage('webrtc-answer')
  handleAnswer(@MessageBody() data: any) {
    this.server.to(`user:${data.to}`).emit('webrtc-answer', data);
  }

  @SubscribeMessage('webrtc-candidate')
  handleCandidate(@MessageBody() data: any) {
    this.server.to(`user:${data.to}`).emit('webrtc-candidate', data);
  }
}

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.client = createClient({
      socket: {
        host: this.configService.get('REDIS_HOST') || 'localhost',
        port: parseInt(this.configService.get('REDIS_PORT') || '6379'),
      },
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    await this.client.connect();
    console.log('✅ Redis connected');
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): RedisClientType {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async setUserOnline(userId: string): Promise<void> {
    await this.set(`user:${userId}:online`, '1', 300);
  }

  async setUserOffline(userId: string): Promise<void> {
    await this.del(`user:${userId}:online`);
  }

  async isUserOnline(userId: string): Promise<boolean> {
    const result = await this.get(`user:${userId}:online`);
    return result === '1';
  }

  async addToMatchingQueue(userId: string, level: string): Promise<void> {
    await this.client.sAdd(`matching:${level}`, userId);
  }

  async removeFromMatchingQueue(userId: string, level: string): Promise<void> {
    await this.client.sRem(`matching:${level}`, userId);
  }

  async getMatchingQueue(level: string): Promise<string[]> {
    return await this.client.sMembers(`matching:${level}`);
  }

  async setVideoCallRoom(roomId: string, data: any, ttl: number = 3600): Promise<void> {
    await this.set(`videocall:${roomId}`, JSON.stringify(data), ttl);
  }

  async getVideoCallRoom(roomId: string): Promise<any> {
    const data = await this.get(`videocall:${roomId}`);
    return data ? JSON.parse(data) : null;
  }

  async deleteVideoCallRoom(roomId: string): Promise<void> {
    await this.del(`videocall:${roomId}`);
  }
}

import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { UsersModule } from '../users/users.module';
import { CertificateService } from './certificate.service';

@Module({
  imports: [UsersModule],
  controllers: [TestController],
  providers: [TestService, CertificateService],
})
export class TestModule {}

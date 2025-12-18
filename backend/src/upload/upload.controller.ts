import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('profile-photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const filePath = await this.uploadService.uploadFile(file, 'profiles');
    return { url: filePath };
  }

  @Post('content')
  @UseInterceptors(FileInterceptor('file'))
  async uploadContent(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const filePath = await this.uploadService.uploadFile(file, 'content');
    return { url: filePath };
  }
}

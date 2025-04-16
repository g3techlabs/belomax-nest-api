import { Module } from '@nestjs/common';
import { S3Provider } from './s3/s3.provider';
import { S3AddFileService } from './s3/services/upload-s3-file.service';

@Module({
  imports: [],
  controllers: [],
  providers: [S3Provider, S3AddFileService],
  exports: [S3AddFileService],
})
export class AwsModule {}

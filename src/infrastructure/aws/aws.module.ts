import { Module } from '@nestjs/common';
import { S3Provider } from './s3/s3.provider';
import { S3AddFileService } from './s3/services/upload-s3-file.service';
import { S3GetFileService } from './s3/services/get-s3-file.service';

@Module({
  imports: [],
  controllers: [],
  providers: [S3Provider, S3AddFileService, S3GetFileService],
  exports: [S3AddFileService, S3GetFileService],
})
export class AwsModule {}

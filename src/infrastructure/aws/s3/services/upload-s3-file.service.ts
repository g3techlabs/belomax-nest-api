/* eslint-disable */
import { Inject, Injectable } from '@nestjs/common';
import { S3Provider } from '../s3.provider';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { UploadS3FileInput } from '../input/upload-s3-file.input';

@Injectable()
export class S3AddFileService {
  constructor(
    @Inject(S3Provider) private readonly s3: S3Provider,
    private readonly configService: ConfigService,
  ) {}

  async execute({ file, name, mimeType }: UploadS3FileInput) {
    try {
      await this.s3.getClient().send(
        new PutObjectCommand({
          Bucket: this.configService.get('AWS_S3_BUCKET'),
          Key: name,
          Body: file,
          ContentType: mimeType,
        }),
      ).then(res => console.log(res))

      return true
    } catch (error) {
      console.log('Error uploading file to S3:', error);
      throw new Error('Failed to upload file to S3');
    }
  }
}
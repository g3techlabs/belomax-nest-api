import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Provider {
  private s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId: string | undefined =
      this.configService.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey: string | undefined = this.configService.get(
      'AWS_SECRET_ACCESS_KEY',
    );

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials are not properly configured');
    }

    this.s3 = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials:
        accessKeyId && secretAccessKey
          ? {
              accessKeyId,
              secretAccessKey,
            }
          : undefined,
    });
  }

  getClient(): S3Client {
    return this.s3;
  }
}

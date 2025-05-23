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
      endpoint:
        this.configService.get<string>('AWS_LOCALSTACK_ENDPOINT') ?? undefined,
      forcePathStyle: this.configService.get<string>('AWS_LOCALSTACK_ENDPOINT')
        ? true
        : false,
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

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-s3/

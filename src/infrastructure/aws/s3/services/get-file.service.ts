import { Injectable } from '@nestjs/common';
import { S3Provider } from '../s3.provider';
import { ConfigService } from '@nestjs/config';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3GetFileService {
  constructor(
    private readonly s3: S3Provider,
    private readonly configService: ConfigService,
  ) {}

  async execute(key: string) {
    try {
      const bucket: string = this.configService.get('AWS_S3_BUCKET') ?? '';

      const params = {
        Bucket: bucket,
        Key: key,
      };

      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(this.s3.getClient(), command, {
        expiresIn: 900, // 15 minutes
      });

      const response = await this.s3.getClient().send(command);

      return {
        object: response,
        url,
      };
    } catch (error) {
      console.error('Error retrieving file from S3:', error);
      throw new Error('Failed to retrieve file from S3');
    }
  }
}

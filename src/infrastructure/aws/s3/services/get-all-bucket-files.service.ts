import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { S3Provider } from '../s3.provider';
import {
  _Object,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

@Injectable()
export class GetAllBucketFilesService {
  private bucket = this.getBucketName();

  constructor(
    private readonly s3: S3Provider,
    private readonly configService: ConfigService,
  ) {}

  async execute() {
    const objects = await this.listFiles();
    const files = await this.getAllObjects(objects);
    return files;
  }

  private getBucketName(): string {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET');

    if (!bucket) throw new Error('Bucket name not defined');

    return bucket;
  }

  private async listFiles() {
    const command = this.buildListObjectsCommand();
    const objects = await this.listObjects(command);
    return objects;
  }

  private async listObjects(command: ListObjectsV2Command): Promise<_Object[]> {
    const response = await this.s3.getClient().send(command);
    return response.Contents ?? [];
  }

  private buildListObjectsCommand(): ListObjectsV2Command {
    return new ListObjectsV2Command({ Bucket: this.bucket });
  }

  private async getAllObjects(
    objects: _Object[],
  ): Promise<Uint8Array<ArrayBufferLike>[]> {
    const files = objects.map(async (object) => {
      const command = this.buildGetObjectCommand(object.Key ?? '');
      const response = await this.s3.getClient().send(command);

      if (!response.Body) {
        throw new Error(`${object.Key} had a undefined body`);
      }

      return response.Body?.transformToByteArray();
    });
    return Promise.all(files);
  }

  private buildGetObjectCommand(key: string): GetObjectCommand {
    return new GetObjectCommand({ Bucket: this.bucket, Key: key });
  }
}

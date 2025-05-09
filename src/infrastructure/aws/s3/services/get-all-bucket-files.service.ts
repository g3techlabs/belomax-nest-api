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
  private bucket: string;

  constructor(
    private readonly s3: S3Provider,
    private readonly configService: ConfigService,
  ) {}

  async execute(keys?: string[]) {
    try {
      this.bucket = this.getBucketName();
      const objects = await this.listFiles(keys);
      const files = await this.getAllObjects(objects);
      return files;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  private getBucketName(): string {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET');

    if (!bucket) throw new Error('Bucket name not defined');

    return bucket;
  }

  private async listFiles(filterKeys?: string[]) {
    const command = this.buildListObjectsCommand();
    const objects = await this.listObjects(command);

    return filterKeys && filterKeys.length !== 0
      ? this.filterObjects(filterKeys, objects)
      : objects;
  }

  private filterObjects(keys: string[], objects: _Object[]) {
    return objects.filter((object) => keys.includes(object.Key ?? ''));
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
  ): Promise<{ buffer: Buffer; name: string }[]> {
    const files = objects.map(async (object) => {
      const command = this.buildGetObjectCommand(object.Key ?? '');
      const response = await this.s3.getClient().send(command);

      if (!response.Body) {
        throw new Error(`${object.Key} had a undefined body`);
      }
      const buffer = this.convertUint8ArrayToBuffer(
        await response.Body?.transformToByteArray(),
      );
      return {
        buffer,
        name: object.Key ?? '',
      };
    });
    return Promise.all(files);
  }

  private buildGetObjectCommand(key: string): GetObjectCommand {
    return new GetObjectCommand({ Bucket: this.bucket, Key: key });
  }

  private convertUint8ArrayToBuffer(file: Uint8Array<ArrayBufferLike>): Buffer {
    return Buffer.from(file);
  }
}

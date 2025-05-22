import { BadRequestException, Injectable } from '@nestjs/common';
import { S3GetFileService } from '../../../infrastructure/aws/s3/services/get-file.service';
import { DocumentRepository } from '../repositories/document.repository';
import { addMinutes } from 'date-fns';

@Injectable()
export class GetDocumentUrlService {
  constructor(
    private readonly s3GetFileService: S3GetFileService,
    private readonly documentRepository: DocumentRepository,
  ) {}

  async execute(id: string): Promise<string> {
    const document = await this.documentRepository.findById(id);

    if (!document) {
      throw new Error('Document not found');
    }

    const s3file = await this.s3GetFileService.execute(document.name);

    const { url } = s3file;

    if (!url) {
      throw new BadRequestException('Failed to get file URL');
    }

    await this.documentRepository.update(id, {
      urlExpiresAt: addMinutes(new Date(), 15),
    });

    return url;
  }
}

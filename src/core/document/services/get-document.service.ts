import { DocumentRepository } from '../repositories/document.repository';
import { S3GetFileService } from './../../../infrastructure/aws/s3/services/get-file.service';
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class GetDocumentService {
  constructor(
    private readonly s3GetFileService: S3GetFileService,
    private readonly documentsRepository: DocumentRepository,
  ) {}

  async execute(documentId: string) {
    try {
      const { name: documentName } = await this.getDocument(documentId);

      return this.getFIleFromS3(documentName);
    } catch (error) {
      console.error('Error managing the file after S3 response', error);
    }
  }

  private async getDocument(documentId: string) {
    const document = await this.documentsRepository.findById(documentId);

    if (!document) throw new NotFoundException('Document not found');

    return document;
  }

  private async getFIleFromS3(documentName: string) {
    const { object } = await this.s3GetFileService.execute(documentName);

    if (!object)
      throw new Error(`File ${documentName} could not be found in S3`);

    return object;
  }
}

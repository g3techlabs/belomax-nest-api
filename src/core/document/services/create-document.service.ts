import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DocumentRepository } from '../repositories/document.repository';
import { CreateDocumentServiceInput } from '../inputs/create-document.input';
import { Document } from '@prisma/client';
import { FindByIdAutomationService } from 'src/core/automation/services/find-by-id-automation.service';
import { S3AddFileService } from 'src/infrastructure/aws/s3/services/upload-s3-file.service';
import { S3GetFileService } from 'src/infrastructure/aws/s3/services/get-s3-file.service';

@Injectable()
export class CreateDocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly findByIdAutomationService: FindByIdAutomationService,
    private readonly s3AddFileService: S3AddFileService,
    private readonly s3GetFileService: S3GetFileService,
  ) {}

  async execute(data: CreateDocumentServiceInput): Promise<Document> {
    const { automationId, file } = data;

    if (!file) {
      throw new BadRequestException('File not found');
    }

    const automation =
      await this.findByIdAutomationService.execute(automationId);

    if (!automation) {
      throw new NotFoundException('Automation not found');
    }

    const s3DocumentName = `${automation.id}-${new Date().toISOString()}-${file.originalname}`;

    const fileUploaded = await this.s3AddFileService.execute({
      file: file.buffer,
      name: s3DocumentName,
      mimeType: file.mimetype,
    });

    if (!fileUploaded) {
      throw new BadRequestException('Failed to upload file');
    }

    return await this.documentRepository.create({
      ...data,
      name: s3DocumentName,
    });
  }
}

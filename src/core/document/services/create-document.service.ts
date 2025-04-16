import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DocumentRepository } from '../repositories/document.repository';
import { CreateDocumentInput } from '../inputs/create-document.input';
import { Document } from '@prisma/client';
import { FindByIdAutomationService } from 'src/core/automation/services/find-by-id-automation.service';
import { S3AddFileService } from 'src/infrastructure/aws/s3/services/upload-s3-file.service';

@Injectable()
export class CreateDocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly findByIdAutomationService: FindByIdAutomationService,
    private readonly s3AddFileService: S3AddFileService,
  ) {}

  async execute(data: CreateDocumentInput): Promise<Document> {
    const { automationId, file } = data;

    if (!file) {
      throw new BadRequestException('File not found');
    }

    const automation =
      await this.findByIdAutomationService.execute(automationId);

    if (!automation) {
      throw new NotFoundException('Automation not found');
    }

    const documentUrl = await this.s3AddFileService.execute({
      file: file.buffer,
      name: `${automation.id}-${file.originalname}-${new Date().toISOString()}`,
      mimeType: file.mimetype,
    });

    return await this.documentRepository.create({
      ...data,
      url: documentUrl,
    });
  }
}

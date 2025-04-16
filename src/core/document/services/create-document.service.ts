import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentRepository } from '../repositories/document.repository';
import { CreateDocumentInput } from '../inputs/create-document.input';
import { Document } from '@prisma/client';
import { FindByIdAutomationService } from 'src/core/automation/services/find-by-id-automation.service';

@Injectable()
export class CreateDocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly findByIdAutomationService: FindByIdAutomationService,
  ) {}

  async execute(data: CreateDocumentInput): Promise<Document> {
    const { automationId } = data;

    const automation =
      await this.findByIdAutomationService.execute(automationId);

    if (!automation) {
      throw new NotFoundException('Automation not found');
    }

    return await this.documentRepository.create(data);
  }
}

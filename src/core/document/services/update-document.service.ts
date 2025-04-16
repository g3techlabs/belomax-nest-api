import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentRepository } from '../repositories/document.repository';
import { UpdateDocumentInput } from '../inputs/update-document.input';
import { Document } from '@prisma/client';

@Injectable()
export class UpdateDocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(id: string, data: UpdateDocumentInput): Promise<Document> {
    const document = await this.documentRepository.findById(id);

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const updatedDocument = await this.documentRepository.update(id, data);

    return updatedDocument;
  }
}

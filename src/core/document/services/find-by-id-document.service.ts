import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentRepository } from '../repositories/document.repository';
import { Document } from '@prisma/client';

@Injectable()
export class FindByIdDocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(id: string): Promise<Document> {
    const document = await this.documentRepository.findById(id);

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }
}

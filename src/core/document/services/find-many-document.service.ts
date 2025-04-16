import { Injectable } from '@nestjs/common';
import { DocumentRepository } from '../repositories/document.repository';
import { Document } from '@prisma/client';

@Injectable()
export class FindManyDocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(): Promise<Document[]> {
    return await this.documentRepository.findMany();
  }
}

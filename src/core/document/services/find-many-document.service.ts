import { Injectable } from '@nestjs/common';
import { DocumentRepository } from '../repositories/document.repository';
import { Document } from '@prisma/client';
import { FindManyDocumentInput } from '../inputs/find-many-document.input';

@Injectable()
export class FindManyDocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(data: FindManyDocumentInput): Promise<Document[]> {
    return await this.documentRepository.findMany(data);
  }
}

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

    // to change name, create a new s3 object with the new name, keep the date and time
    // and delete the old one
    // need to implement delete s3 object

    return updatedDocument;
  }
}

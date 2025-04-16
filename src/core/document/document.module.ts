import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { DocumentController } from './controllers/document.controller';
import { DocumentRepository } from './repositories/document.repository';
import { CreateDocumentService } from './services/create-document.service';
import { FindManyDocumentService } from './services/find-many-document.service';
import { FindByIdDocumentService } from './services/find-by-id-document.service';
import { UpdateDocumentService } from './services/update-document.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DocumentController],
  providers: [
    // Repositories
    DocumentRepository,
    // Services
    CreateDocumentService,
    FindManyDocumentService,
    FindByIdDocumentService,
    UpdateDocumentService,
  ],
  exports: [CreateDocumentService],
})
export class DocumentModule {}

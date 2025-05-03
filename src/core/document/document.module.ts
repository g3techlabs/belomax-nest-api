import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { DocumentController } from './controllers/document.controller';
import { DocumentRepository } from './repositories/document.repository';
import { CreateDocumentService } from './services/create-document.service';
import { FindManyDocumentService } from './services/find-many-document.service';
import { FindByIdDocumentService } from './services/find-by-id-document.service';
import { UpdateDocumentService } from './services/update-document.service';
import { AutomationModule } from '../automation/automation.module';
import { AwsModule } from 'src/infrastructure/aws/aws.module';
import { GetDocumentUrlService } from './services/get-document-url.service';
import { AuthModule } from 'src/auth/auth.module';
import { WebsocketModule } from 'src/infrastructure/websocket/websocket.module';
import { StatementExtractModule } from '../statement-extract/statement-extract.module';
import { ProvideFilledPetitionService } from './services/provide-filled-petition.service';

@Module({
  imports: [
    DatabaseModule,
    AutomationModule,
    AwsModule,
    AuthModule,
    WebsocketModule,
    forwardRef(() => StatementExtractModule),
  ],
  controllers: [DocumentController],
  providers: [
    // Repositories
    DocumentRepository,
    // Services
    CreateDocumentService,
    FindManyDocumentService,
    FindByIdDocumentService,
    UpdateDocumentService,
    GetDocumentUrlService,
    ProvideFilledPetitionService,
  ],
  exports: [
    CreateDocumentService,
    GetDocumentUrlService,
    ProvideFilledPetitionService,
  ],
})
export class DocumentModule {}

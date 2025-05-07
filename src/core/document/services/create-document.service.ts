import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DocumentRepository } from '../repositories/document.repository';
import { CreateDocumentServiceInput } from '../inputs/create-document.input';
import { AutomationStatus, Document } from '@prisma/client';
import { FindByIdAutomationService } from 'src/core/automation/services/find-by-id-automation.service';
import { S3AddFileService } from 'src/infrastructure/aws/s3/services/upload-s3-file.service';
import { WsAutomationsService } from 'src/infrastructure/websocket/automations/automation-websocket.service';
import { S3GetFileService } from 'src/infrastructure/aws/s3/services/get-file.service';
import { CountStatementExtractExpectedDocumentsService } from 'src/core/statement-extract/services/count-statement-extract-expected-documents.service';
import { ChangeStatusAutomationService } from 'src/core/automation/services/change-status-automation.service';

@Injectable()
export class CreateDocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly findByIdAutomationService: FindByIdAutomationService,
    private readonly countStatementExtractExpectedDocumentsService: CountStatementExtractExpectedDocumentsService,
    private readonly changeStatusAutomationService: ChangeStatusAutomationService,
    private readonly s3AddFileService: S3AddFileService,
    private readonly s3GetFileService: S3GetFileService,
    private readonly wsAutomationsService: WsAutomationsService,
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

    if (
      automation.status === AutomationStatus.FINISHED ||
      automation.status === AutomationStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Automation is not in a valid state to add a document',
      );
    }

    const s3DocumentName = `${data.name.replaceAll(' ', '_')}-${automation.id}-${new Date().toISOString()}-${file.originalname}`;

    const fileUploaded = await this.s3AddFileService.execute({
      file: file.buffer,
      name: s3DocumentName,
      mimeType: file.mimetype,
    });

    if (!fileUploaded) {
      throw new BadRequestException('Failed to upload file');
    }

    const createdDocument = await this.documentRepository.create({
      ...data,
      name: s3DocumentName,
    });

    const signedUrl = (await this.s3GetFileService.execute(s3DocumentName)).url;

    this.wsAutomationsService.notifyDocumentAdded(
      {
        document: {
          id: createdDocument.id,
          name: createdDocument.name,
          url: signedUrl,
        },
      },
      automationId,
      automation?.userId || undefined,
    );

    let expectedDocumentCount = 0;
    let changeAutomationStatus = false;

    if (automation.statementExtract) {
      expectedDocumentCount =
        await this.countStatementExtractExpectedDocumentsService.execute(
          createdDocument.automationId,
        );

      // eslint-disable-next-line
      const currentDocumentCount = await this.documentRepository.countByAutomationId(automationId);

      if (currentDocumentCount > expectedDocumentCount) {
        throw new BadRequestException(
          `A automação já possui o número de documentos esperados: (${expectedDocumentCount}) documentos`,
        );
      }

      if (currentDocumentCount === expectedDocumentCount) {
        changeAutomationStatus = true;
      }
    }

    if (changeAutomationStatus) {
      await this.changeStatusAutomationService.execute(automationId, {
        status: AutomationStatus.FINISHED,
      });
    }

    return createdDocument;
  }
}

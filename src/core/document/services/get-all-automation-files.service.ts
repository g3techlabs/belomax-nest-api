import { GetAllBucketFilesService } from './../../../infrastructure/aws/s3/services/get-all-bucket-files.service';
import { DocumentRepository } from './../repositories/document.repository';
import { Injectable } from '@nestjs/common';
import * as archiver from 'archiver';
import { GetAllAutomationFilesInput } from '../inputs/get-all-automation-files.input';

@Injectable()
export class GetAllAutomationFilesService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly getAllBucketFilesService: GetAllBucketFilesService,
  ) {}

  async execute({ automationId, customerName }: GetAllAutomationFilesInput) {
    const documentsName = await this.retrieveDocuments(automationId);

    const archive = archiver('zip', { zlib: { level: 9 } });

    const files = await this.getAllBucketFilesService.execute(documentsName);

    if (files) {
      const finalized = this.setZipFile(files, archive);

      const costumerNameFormatted = this.formatCustomerName(customerName);
      return {
        file: archive,
        name: `${costumerNameFormatted}-files.zip`,
        finalized,
      };
    } else throw new Error('const files is undefined');
  }

  private async retrieveDocuments(automationId: string): Promise<string[]> {
    const automationDocuments =
      await this.documentRepository.findDocumentsByAutomationId(automationId);

    const documentsName = automationDocuments.map((value) => value.name);

    return documentsName;
  }

  private async setZipFile(
    files: { buffer: Buffer; name: string }[],
    archive: archiver.Archiver,
  ) {
    this.appendFiles(files, archive);
    return archive.finalize();
  }

  private appendFiles(
    files: { buffer: Buffer; name: string }[],
    archive: archiver.Archiver,
  ) {
    files.forEach((file) => {
      // console.log(file)
      archive.append(file.buffer, { name: file.name });
    });
  }

  private formatCustomerName(customerName: string) {
    return customerName.replaceAll(' ', '_');
  }
}

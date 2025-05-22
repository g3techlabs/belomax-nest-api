import { PDFDocument } from 'pdf-lib';
import { PensionerPaycheck } from '../entities/pensioner-paycheck';
import { GetAllBucketFilesService } from './../../../infrastructure/aws/s3/services/get-all-bucket-files.service';
import { PensionerPaycheckRepository } from './../repositories/pensioner-paycheck.repository';
import { Injectable } from '@nestjs/common';
import { MergeAllPensionerReportsInput } from '../inputs/merge-all-pensioner-reports.input';
import { Readable } from 'stream';

@Injectable()
export class MergeAllPensionerReportsService {
  constructor(
    private readonly pensionerPaycheckRepository: PensionerPaycheckRepository,
    private readonly getAllBucketFilesService: GetAllBucketFilesService,
  ) {}

  async execute(data: MergeAllPensionerReportsInput) {
    try {
      const pensionerPaychecks = await this.getAllCustomerPaychecks(data);

      const documentsNames = this.getAllDocumentsNames(pensionerPaychecks);

      const files = await this.getAllFilesFromS3(documentsNames);

      const pdfBuffer = await this.mergePdfs(files);

      const stream = Readable.from([pdfBuffer]);

      return stream;
    } catch (error) {
      console.error(
        'Erro ao mesclar comprovantes de rendimentos em um só: ',
        error,
      );
    }
  }

  private async getAllCustomerPaychecks({
    customerId,
    initialMonth,
    initialYear,
    finalMonth,
    finalYear,
  }: MergeAllPensionerReportsInput) {
    return await this.pensionerPaycheckRepository.findManyOrderedFromDate({
      customerId,
      initialMonth,
      initialYear,
      finalMonth,
      finalYear,
    });
  }

  private getAllDocumentsNames(pensionerPaychecks: PensionerPaycheck[]) {
    return pensionerPaychecks.flatMap((pensionerPaycheck) =>
      pensionerPaycheck.automation.documents.map(({ name }) => name),
    );
  }

  private async getAllFilesFromS3(documentsNames: string[]) {
    return await this.getAllBucketFilesService.execute(documentsNames);
  }

  private async mergePdfs(files: { buffer: Buffer; name: string }[]) {
    const pdfs = await this.loadPdfs(files);

    const mergedPdf = await this.mergePdfsIntoFirst(pdfs);

    return mergedPdf;
  }

  private async loadPdfs(files: { buffer: Buffer; name: string }[]) {
    return await Promise.all(
      files.map(({ buffer }) => PDFDocument.load(buffer)),
    );
  }

  private async mergePdfsIntoFirst(pdfs: PDFDocument[]) {
    const firstPdf = pdfs[0];

    for (let i = 1; i < pdfs.length; i++) {
      const currentPdf = pdfs[i];
      const copiedPages = await firstPdf.copyPages(
        currentPdf,
        currentPdf.getPageIndices(),
      );
      copiedPages.forEach((page) => firstPdf.addPage(page));
    }

    return await firstPdf.save();
  }
}

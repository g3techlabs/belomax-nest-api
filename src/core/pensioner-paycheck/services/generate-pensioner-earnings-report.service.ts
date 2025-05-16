import { LaunchedChrome } from './../../../../node_modules/html-pdf-chrome/node_modules/chrome-launcher/dist/chrome-launcher.d';
import { CreateDocumentService } from './../../document/services/create-document.service';
import { GeneratePensionerEarningsReportDTO } from './../dtos/generate-pensioner-earnings-report.dto';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as htmlPdf from 'html-pdf-chrome';
import { MulterFileFactory } from 'src/utils/multer-file-factory';

@Injectable()
export class GeneratePensionerEarningsReportService {
  private PENSIONER_SERVICE_URL: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly createDocumentService: CreateDocumentService,
  ) {
    this.PENSIONER_SERVICE_URL =
      this.configService.get<string>('PENSIONER_EARNING_REPORT_URL') ?? '';

    if (this.PENSIONER_SERVICE_URL === '') {
      throw new Error('.env do not have PENSIONER_EARNING_REPORT_URL value');
    }
  }

  async execute(data: GeneratePensionerEarningsReportDTO) {
    try {
      const mountedURL = this.mountURLQueries(data);

      const pdfBuffer = await this.getPdfBuffer(mountedURL);

      const pdfFile = this.convertBufferToMulterFile(
        pdfBuffer,
        data.customerName,
      );

      await this.registerDocument(pdfFile, data.automationId);
    } catch (err) {
      console.error(
        'Erro inesperado ocorreu ao gerar arquivo de rendimentos de pensionista.',
        err,
      );
    }
  }

  private mountURLQueries({
    registration,
    bond,
    cpf,
    pensionerNumber,
    month,
    year,
  }: GeneratePensionerEarningsReportDTO) {
    const mountedURL =
      this.PENSIONER_SERVICE_URL +
      `?matricula=${registration.replaceAll('-', '')}&` +
      `vinculo=${bond}&` +
      `numpens=${pensionerNumber}&` +
      `cpf=${cpf}&` +
      `ano=${year}&` +
      `mes=${month}&` +
      `tipofolha=NORMAL`;

      console.log(mountedURL)

    return mountedURL;
  }

  private async getPdfBuffer(
    mountedURL: string,
  ): Promise<Buffer<ArrayBufferLike>> {
    const options: htmlPdf.CreateOptions = {
      chromePath: '/snap/bin/chromium',
      clearCache: true,
    }

    return await htmlPdf.create(mountedURL, options).then((pdf) => pdf.toBuffer());
  }

  private convertBufferToMulterFile(file: Buffer, customerName: string) {
    const fileName = this.mountFileName(customerName);
    return MulterFileFactory.fromBufferOrUint8Array(
      file,
      fileName,
      'application/pdf',
    );
  }

  private mountFileName(customerName: string) {
    const today = new Date(Date.now());
    const day = today.getDay();
    const month = today.getMonth();
    const year = today.getFullYear();

    return `COMPROVANTE_PENSIONISTA-${customerName}-${day}-${month}-${year}.pdf`;
  }

  private async registerDocument(file: Express.Multer.File, automationId: string) {
    await this.createDocumentService.execute({
      automationId,
      name: file.filename,
      file: file,
    });
  }

}

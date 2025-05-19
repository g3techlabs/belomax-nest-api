import { CreateDocumentService } from './../../document/services/create-document.service';
import { GeneratePensionerEarningsReportDTO } from './../dtos/generate-pensioner-earnings-report.dto';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
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

      await this.registerDocument(
        pdfFile,
        data.automationId,
        data.customerName,
      );
    } catch (err) {
      console.error(
        'Erro inesperado ocorreu ao gerar arquivo de rendimentos de pensionista:',
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

    return mountedURL;
  }

  private async getPdfBuffer(mountedURL: string): Promise<Uint8Array> {
    const browser = await puppeteer.launch({
      args: [
        '--disable-features=HttpsFirstBalancedModeAutoEnable',
        '--no-sandbox',
      ],
      headless: true,
    });
    const page = await browser.newPage();

    await page.goto(mountedURL);

    return await page.pdf();
  }

  private convertBufferToMulterFile(file: Uint8Array, customerName: string) {
    const fileName = this.mountFileName(customerName);
    return MulterFileFactory.fromBufferOrUint8Array(
      file,
      fileName,
      'application/pdf',
    );
  }

  private mountFileName(customerName: string) {
    return `COMPROVANTE_PENSIONISTA-${customerName}.pdf`;
  }

  private async registerDocument(
    file: Express.Multer.File,
    automationId: string,
    customerName: string,
  ) {
    await this.createDocumentService.execute({
      automationId,
      name: `COMPROVANTE_PENSIONISTA-${customerName}.pdf`,
      file: file,
    });
  }
}

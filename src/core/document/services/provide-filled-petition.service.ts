import { CreateDocumentService } from './create-document.service';
import { Injectable } from '@nestjs/common';
import { ProvideFilledPetitionInput } from '../inputs/provide-filled-petition.input';
import * as fs from 'fs';
import * as path from 'path';
import * as PizZip from 'pizzip';
import * as DocxTemplater from 'docxtemplater';
import * as numero from 'numero-por-extenso';
import { formatAddress } from '../dto/address.dto';
import { MulterFileFactory } from 'src/utils/multer-file-factory';

@Injectable()
export class ProvideFilledPetitionService {
  private docxFile: DocxTemplater;
  private ASKED_VALUE = 20000

  constructor(private readonly createDocumentService: CreateDocumentService) {}

  async execute({ author, bank, term, chargedValue }: ProvideFilledPetitionInput) {
    try {
      this.getDocxFile();

      this.populateFile({ author, bank, term, chargedValue });

      const buffer = this.getBufferFromDocx(this.docxFile);

      const multerFile = MulterFileFactory.fromBufferOrUint8Array(buffer);

      await this.createDocumentService.execute({
        name: `PETICAO`,
        automationId: 'uuid',
        file: multerFile,
      });
    } catch (err) {
      console.log(err);
    }
  }

  private getDocxFile() {
    const binaryFile = this.getFileInBinary();
    const unzippedFile = this.unzipFile(binaryFile);
    this.docxFile = this.loadDocxTemplater(unzippedFile);
  }

  private getFileInBinary(): string {
    const filePath = path.resolve(`public`, 'peticao.docx');
    const binaryContent = fs.readFileSync(filePath, 'binary');
    return binaryContent;
  }

  private unzipFile(file: string) {
    return new PizZip(file);
  }

  private loadDocxTemplater(unzippedFile: PizZip): DocxTemplater {
    const docx = new DocxTemplater(unzippedFile, {
      paragraphLoop: true,
      linebreaks: true,
    });

    return docx;
  }

  private populateFile(
    { author, bank, term, chargedValue }: ProvideFilledPetitionInput,
  ) {
    this.docxFile.render({
      name: author.name,
      citizenship: author.citizenship,
      maritalStatus: author.maritalStatus,
      occupation: author.occupation,
      rg: author.rg,
      cpf: author.cpf,
      address: formatAddress(author.address),
      bankName: bank.name,
      bankCnpj: bank.cnpj,
      bankAddress: formatAddress(bank.address),
      accountNumber: author.account.number,
      accountAgency: author.account.agency,
      term,
      chargedValue,
      chargedValueDouble: chargedValue * 2,
      chargedValueInFull: numero.porExtenso(chargedValue, numero.estilo.monetario),
      askedValuePlusChargedValue: chargedValue + this.ASKED_VALUE,
      askedValuePlusChargedValueInFull: numero.porExtenso(chargedValue + this.ASKED_VALUE, numero.estilo.monetario)
    });
    console.log(numero.porExtenso(chargedValue, numero.estilo.monetario))
    console.log(numero.porExtenso(chargedValue + this.ASKED_VALUE, numero.estilo.monetario))
  }

  private getBufferFromDocx(docx: DocxTemplater) {
    const buffer = docx.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    return buffer;
  }
}

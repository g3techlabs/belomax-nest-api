/* eslint-disable */

import { CreateDocumentService } from './create-document.service';
import { Injectable } from '@nestjs/common';
import { ProvideFilledPetitionInput, ProvideFilledPetitionPopulateInfoInput } from '../inputs/provide-filled-petition.input';
import * as fs from 'fs';
import * as path from 'path';
import * as PizZip from 'pizzip';
import * as DocxTemplater from 'docxtemplater';
import * as numero from 'numero-por-extenso';
import { formatAddress } from '../dto/address.dto';
import { MulterFileFactory } from 'src/utils/multer-file-factory';
import { StatementBank } from '@prisma/client';
import { Bank } from '../dto/bank.dto';
import { parseValueToBrl } from 'src/utils/parse-value-to-brl';

@Injectable()
export class ProvideFilledPetitionService {
  private docxFile: DocxTemplater;
  private ASKED_VALUE = 20000;

  constructor(private readonly createDocumentService: CreateDocumentService) {}

  async execute({
    author,
    bank,
    term,
    chargedValue,
    automationId
  }: ProvideFilledPetitionInput) {
    try {
      this.getDocxFile();

      this.populateFile({ author, bank: this.getBankInfo(bank), term, chargedValue });

      const buffer = this.getBufferFromDocx(this.docxFile);

      const multerFile = MulterFileFactory.fromBufferOrUint8Array(buffer);

      await this.createDocumentService.execute({
        name: `PETICAO-${term}`,
        automationId: automationId,
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

  private populateFile({
    author,
    bank,
    term,
    chargedValue,
  }: ProvideFilledPetitionPopulateInfoInput) {
    this.docxFile.render({
      name: author.name ?? 'não informado',
      citizenship: author.citizenship ?? 'não informado',
      maritalStatus: author.maritalStatus ?? 'não informado',
      occupation: author.occupation ?? 'não informado',
      rg: author.rg ?? 'não informado',
      cpf: author.cpfCnpj ?? 'não informado',
      address: author.address ?? 'não informado',
      bankName: bank.name ?? 'não informado',
      bankCnpj: bank.cnpj ?? 'não informado',
      bankAddress: bank.address ?? 'não informado',
      accountNumber: 'não informado',
      accountAgency: 'não informado',
      term,
      chargedValue: parseValueToBrl(chargedValue),
      chargedValueDouble: parseValueToBrl(chargedValue * 2),
      chargedValueInFull: numero.porExtenso(
        chargedValue,
        numero.estilo.monetario,
      ),
      chargedValueDoubleInFull: numero.porExtenso(
        chargedValue * 2,
        numero.estilo.monetario,
      ),
      askedValuePlusChargedValue: parseValueToBrl(chargedValue + this.ASKED_VALUE),
      askedValuePlusChargedValueInFull: numero.porExtenso(
        chargedValue + this.ASKED_VALUE,
        numero.estilo.monetario,
      ),
    });
  }

  private getBufferFromDocx(docx: DocxTemplater) {
    const buffer = docx.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    return buffer;
  }

  private getBankInfo(bank: StatementBank): Bank {
    const bankInfo = {
      BRADESCO: {
        name: 'Banco Bradesco S.A',
        cnpj: '60.746.948/0001-12',
        address: "Núcleo Administrativo Cidade de Deus, S/N, Vila Yara, Osasco/SP, CEP 06029-900"
      },
      BB: {
        name: 'Banco do Brasil S.A',
        cnpj: '00.000.000/0001-91',
        address: "Setor Bancário Sul, Quadra 1, Bloco G, Bairro Asa Sul Brasília/DF, CEP 70074-900"
      },
      CAIXA: {
        name: 'Caixa Econômica Federal',
        cnpj: '00.360.305/0001-04',
        address: "Setor Bancário Sul, Quadra 4, Bloco A, Bairro Asa Sul Brasília/DF, CEP 70074-900"
      }
    }
    
    switch (bank) {
      case StatementBank.BRADESCO:
        return bankInfo.BRADESCO;
      case StatementBank.BB:
        return bankInfo.BB;
      case StatementBank.CAIXA:
        return bankInfo.CAIXA;
      default:
        throw new Error('Bank not supported');
    }
  }
}

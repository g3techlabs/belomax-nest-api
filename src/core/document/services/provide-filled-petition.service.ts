/* eslint-disable */

import { CreateDocumentService } from './create-document.service';
import { Injectable } from '@nestjs/common';
import {
  ProvideFilledPetitionInput,
  ProvideFilledPetitionPopulateInfoInput,
} from '../inputs/provide-filled-petition.input';
import * as fs from 'fs';
import * as path from 'path';
import * as PizZip from 'pizzip';
import * as DocxTemplater from 'docxtemplater';
import * as numero from 'numero-por-extenso';
import { MulterFileFactory } from 'src/utils/multer-file-factory';
import { AutomationStatus, StatementBank } from '@prisma/client';
import { Bank } from '../dto/bank.dto';
import { parseValueToBrl } from 'src/utils/parse-value-to-brl';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'
import { ChangeStatusAutomationService } from 'src/core/automation/services/change-status-automation.service';

@Injectable()
export class ProvideFilledPetitionService {
  private docxFile: DocxTemplater;
  private ASKED_VALUE = 20000;

  constructor(
    private readonly createDocumentService: CreateDocumentService,
    private readonly changeStatusAutomationService: ChangeStatusAutomationService,
  ) {}

  async execute({
    author,
    bank,
    term,
    chargedValue,
    address,
    automationId,
  }: ProvideFilledPetitionInput) {
    try {
      this.getDocxFile();

      this.populateFile({
        author,
        address: this.parseAddressToBrazilianFormat({
          street: address.street,
          number: address.number,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          zipcode: address.zipcode,
          additional: address.additional || undefined,
        }),
        bank: this.getBankInfo(bank),
        term,
        chargedValue,
      });

      const buffer = this.getBufferFromDocx(this.docxFile);

      const multerFile = MulterFileFactory.fromBufferOrUint8Array(buffer);

      await this.createDocumentService.execute({
        name: `PETICAO-${term}-${author.name}-${bank}`,
        automationId: automationId,
        file: multerFile,
      });
    } catch (err) {
      console.log(err);

      await this.changeStatusAutomationService.execute(automationId, {
        status: AutomationStatus.FAILED,
         
        error: err.message || 'Erro inesperado ao criar petição.',
      });
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
    address,
  }: ProvideFilledPetitionPopulateInfoInput) {
    this.docxFile.render({
      name: author.name ?? 'não informado',
      citizenship: author.citizenship ?? 'não informado',
      maritalStatus: author.maritalStatus ?? 'não informado',
      occupation: author.occupation ?? 'não informado',
      rg: author.rg ?? 'não informado',
      cpf: author.cpfCnpj ?? 'não informado',
      address: address ?? 'não informado',
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
      askedValuePlusChargedValue: parseValueToBrl(
        chargedValue * 2 + this.ASKED_VALUE,
      ),
      askedValuePlusChargedValueInFull: numero.porExtenso(
        chargedValue * 2 + this.ASKED_VALUE,
        numero.estilo.monetario,
      ),
      todayDate: format(new Date(Date.now()), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
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
        address:
          'Núcleo Administrativo Cidade de Deus, S/N, Vila Yara, Osasco/SP, CEP 06029-900',
      },
      BB: {
        name: 'Banco do Brasil S.A',
        cnpj: '00.000.000/0001-91',
        address:
          'Setor Bancário Sul, Quadra 1, Bloco G, Bairro Asa Sul Brasília/DF, CEP 70074-900',
      },
      CAIXA: {
        name: 'Caixa Econômica Federal',
        cnpj: '00.360.305/0001-04',
        address:
          'Setor Bancário Sul, Quadra 4, Bloco A, Bairro Asa Sul Brasília/DF, CEP 70074-900',
      },
    };

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

  private parseAddressToBrazilianFormat(address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
    additional?: string;
  }): string {
    const { street, number, neighborhood, city, state, zipcode, additional } =
      address;

    // Format the address string
    let formattedAddress = `${street}, ${number}, ${neighborhood}, CEP ${zipcode} ${city}/${state}`;

    // Append additional information if available
    if (additional) {
      formattedAddress += `, ${additional}`;
    }

    return formattedAddress;
  }
}

/* eslint-disable */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { StatementExtractRepository } from '../repositories/statement-extract.repository';
import { CreateStatementExtractServiceInput } from '../inputs/create-statement-extract.input';
import { FindUserService } from '../../user/services/find-user.service';
import { StatementTermRepository } from '../repositories/statement-term.repository';
import { CreateAutomationService } from '../../automation/services/create-automation.service';
import { CreateDocumentService } from '../../document/services/create-document.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Address, AutomationStatus, StatementExtract } from '@prisma/client';
import { WsAutomationsService } from 'src/infrastructure/websocket/automations/automation-websocket.service';
import { HighlightPdfTermInput } from '../inputs/highlight-pdf-term.input';
import { ChangeStatusAutomationService } from 'src/core/automation/services/change-status-automation.service';
import { ProvideFilledPetitionService } from 'src/core/document/services/provide-filled-petition.service';
import { ExtractValuePythonApiService } from 'src/infrastructure/api/python-api/services/extract-value-python-api.service';
import { FindByIdCustomerService } from 'src/core/customer/services/find-by-id-customer.service';

@Injectable()
export class CreateStatementExtractService {
  constructor(
    private readonly statementExtractRepository: StatementExtractRepository,
    private readonly statementTermRepository: StatementTermRepository,
    private readonly findUserService: FindUserService,
    private readonly createAutomationService: CreateAutomationService,
    private readonly createDocumentService: CreateDocumentService,
    private readonly wsAutomationsService: WsAutomationsService,
    private readonly changeStatusAutomationService: ChangeStatusAutomationService,
    private readonly provideFilledPetitionService: ProvideFilledPetitionService,
    private readonly extractValuePythonApiService: ExtractValuePythonApiService,
    private readonly findByIdCustomerService: FindByIdCustomerService,
    @InjectQueue('belomax-python-queue') private readonly pythonQueue: Queue,
    @InjectQueue('belomax-queue') private readonly belomaxQueue: Queue,
  ) {}

  async execute(
    data: CreateStatementExtractServiceInput,
  ): Promise<StatementExtract> {
    const { bank, userId, file, token, description, customerId } = data;

    const selectedTermsArray = Array.isArray(data.selectedTerms)
      ? data.selectedTerms
      : [data.selectedTerms];

    const userExists = await this.findUserService.execute(userId);

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const customerExists =
      await this.findByIdCustomerService.execute(customerId);

    if (!customerExists) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const selectedTermsDescription: string[] = [];

    for (const termId of selectedTermsArray) {
      const termExists = await this.statementTermRepository.findById(termId);

      if (!termExists) {
        throw new BadRequestException(`Termo com ID ${termId} não encontrado`);
      }

      selectedTermsDescription.push(termExists.description);
    }

    const automation = await this.createAutomationService.execute({
      description: description
        ? `${description}: Extração de termos - banco ${bank}`
        : `Extração de termos - banco ${bank}`,
      userId,
      customerId,
    });

    if (!automation) {
      throw new NotImplementedException('Falha ao criar automação');
    }

    const createdStatementExtract =
      await this.statementExtractRepository.create({
        ...data,
        selectedTerms: selectedTermsArray,
        automationId: automation.id,
      });

    this.wsAutomationsService.notifyNewAutomation(
      {
        ...createdStatementExtract.automation,
      },
      createdStatementExtract.automation?.userId || '',
    );

    try {
      const fileData = await this.createDocumentService.execute({
        name: `ORIGINAL-${bank}-${customerExists.name}`,
        file: file,
        automationId: automation.id,
      });

      const queueData = {
        fileAwsName: fileData.name,
        automationId: automation.id,
        bank,
        terms: selectedTermsDescription,
        authToken: token,
        customerName: customerExists.name,
      };

      await this.pythonQueue.add('new-statement-extract', queueData);
    } catch (error) {
      console.error('Error creating document:', error);
      await this.changeStatusAutomationService.execute(automation.id, {
        status: AutomationStatus.FAILED,
        error: 'Documento base não adicionado: ' + error.message,
      });
    }

    try {
      for (const termDescription of selectedTermsDescription) {
        const highlightPdfTerms: HighlightPdfTermInput = {
          automationId: automation.id,
          file,
          term: termDescription,
          customerName: customerExists.name,
          bank,
        };

        this.belomaxQueue.add('highlight-pdf-terms', highlightPdfTerms);
      }
    } catch (error) {
      console.error('Error highlighting PDF terms:', error);
      this.changeStatusAutomationService.execute(automation.id, {
        status: AutomationStatus.FAILED,
        error: 'Erro ao destacar termos no PDF: ' + error.message,
      });
    }

    try {
      for (const termDescription of selectedTermsDescription) {
        const termsValue = await this.extractValuePythonApiService.send({
          file,
          bank,
          term: termDescription,
        });

        this.provideFilledPetitionService.execute({
          term: termDescription,
          bank: data.bank,
          chargedValue: termsValue,
          author: {
            citizenship: automation.customer?.citizenship || 'nao informado',
            cpfCnpj: automation.customer?.cpfCnpj || 'nao informado',
            maritalStatus: automation.customer?.maritalStatus || 'nao informado',
            name: automation.customer?.name || 'nao informado',
            occupation: automation.customer?.occupation || 'nao informado',
            rg: automation.customer?.rg || 'nao informado',
          },
          address: customerExists.address ?? {} as Address,
          automationId: automation.id,
        });
      }
    } catch (error) {
      console.error('Error providing filled petition:', error);
      this.changeStatusAutomationService.execute(automation.id, {
        status: AutomationStatus.FAILED,
        error: 'Erro ao fornecer petição preenchida: ' + error.message,
      });
    }

    return createdStatementExtract;
  }
}

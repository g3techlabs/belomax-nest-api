import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { FindUserService } from 'src/core/user/services/find-user.service';
import { FindByIdCustomerService } from 'src/core/customer/services/find-by-id-customer.service';
import { CreateAutomationService } from 'src/core/automation/services/create-automation.service';
import { AutomationStatus } from '@prisma/client';
import { ChangeStatusAutomationService } from 'src/core/automation/services/change-status-automation.service';
import { WsAutomationsService } from 'src/infrastructure/websocket/automations/automation-websocket.service';
import { TriggerUniquePensionerPaycheckAutomationInput } from '../inputs/trigger-pensioner-paycheck-automation.input';

@Injectable()
export class TriggerPensionerPaycheckAutomationService {
  constructor(
    private readonly findUserService: FindUserService,
    private readonly findByIdCustomerService: FindByIdCustomerService,
    private readonly createAutomationService: CreateAutomationService,
    private readonly changeStatusAutomationService: ChangeStatusAutomationService,
    private readonly wsAutomationsService: WsAutomationsService,
    @InjectQueue('belomax-python-queue') private readonly pythonQueue: Queue,
  ) {}

  async execute(
    userId: string,
    token: string,
    data: TriggerUniquePensionerPaycheckAutomationInput,
  ) {
    const user = await this.findUserService.execute(userId);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const customer = await this.findByIdCustomerService.execute(
      data.customerId,
    );

    if (!customer) {
      throw new BadRequestException('Cliente não encontrado');
    }

    let year = data.initialYear;
    for (let i = data.initialMonth; i <= data.finalMonth && year <= data.finalYear; i++) {
      if (i > 12) {
        i = 1;
        year++;
      }
      const automation = await this.createAutomationService.execute({
        description: `Contracheque de pensionista - ${data.cpf}`,
        userId,
        customerId: data.customerId,
      });

      if (!automation) {
        throw new InternalServerErrorException('Falha ao criar automação');
      }

      try {
        this.wsAutomationsService.notifyNewAutomation(automation, userId);
  
        await this.sendJobsToPythonQueue(data, i, year, token, automation.id);
      } catch (error) {
        await this.changeAutomationStatusToFailed(automation.id, error)
      }
    }
  }

  private convertMonth(month: number): string {
    const months = [
      '',
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    return months[month] || '';
  }

  private async sendJobsToPythonQueue(
    {
      registration,
      bond,
      cpf,
      pensionerNumber,
    }: TriggerUniquePensionerPaycheckAutomationInput,
    month: number,
    year: number,
    authToken: string,
    automationId: string,
  ) {
    const queuePayload = {
      automationId,
      authToken,
      data: [
        {
          registration: registration,
          bond: bond,
          cpf: cpf,
          pensionerNumber: pensionerNumber,
          month: this.convertMonth(month),
          year: String(year),
        },
      ],
    };
    await this.pythonQueue.add('fetch-pensioner-paycheck', queuePayload);
  }

  private async changeAutomationStatusToFailed(
    automationId: string,
    error: any,
  ) {
    await this.changeStatusAutomationService.execute(automationId, {
      status: AutomationStatus.FAILED,
      error: error.message || 'Erro ao adicionar job à fila',
    });
  }
}

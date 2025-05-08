import {
  BadRequestException,
  Injectable,
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

    const automation = await this.createAutomationService.execute({
      description: `Contracheque de pensionista - ${data.cpf}`,
      userId,
      customerId: data.customerId,
    });

    if (!automation) {
      throw new NotImplementedException('Falha ao criar automação');
    }

    this.wsAutomationsService.notifyNewAutomation(automation, userId);

    const queuePayload = {
      cpf: data.cpf,
      matricula: data.registration,
      vinculo: data.bond,
      numpens: data.pensionerNumber,
      mes: this.convertMonth(data.month),
      ano: String(data.year),
      automationId: automation.id,
      authToken: token,
    };

    try {
      await this.pythonQueue.add('fetch-pensioner-paycheck', queuePayload);
    } catch (error) {
      console.error('Erro ao adicionar job à fila:', error);
      await this.changeStatusAutomationService.execute(automation.id, {
        status: AutomationStatus.FAILED,
        // eslint-disable-next-line
        error: error.message || 'Erro ao adicionar job à fila',
      });
    }

    return automation;
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
}

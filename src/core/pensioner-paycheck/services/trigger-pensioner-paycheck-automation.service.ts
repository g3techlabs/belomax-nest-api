import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
import { PensionerPaycheckRepository } from '../repositories/pensioner-paycheck.repository';
import { FindExistingPensionerPaycheckInput } from '../inputs/find-existing-pensioner-paycheck.input';

@Injectable()
export class TriggerPensionerPaycheckAutomationService {
  constructor(
    private readonly findUserService: FindUserService,
    private readonly findByIdCustomerService: FindByIdCustomerService,
    private readonly createAutomationService: CreateAutomationService,
    private readonly changeStatusAutomationService: ChangeStatusAutomationService,
    private readonly wsAutomationsService: WsAutomationsService,
    private readonly pensionerPaycheckRepository: PensionerPaycheckRepository,
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

    for (
      let i = data.initialMonth;
      i <= data.finalMonth && year <= data.finalYear;
      i++
    ) {
      if (i > 12) {
        i = 1;
        year++;
      }

      console.log('i', i);
      console.log('year', year);
      console.log('data.customerId', data.customerId);
      console.log('data', data);

      try {
        const existingPaycheck = await this.validateExistingPensionerPaycheck({
          customerId: data.customerId,
          month: i,
          year,
        });

        if (existingPaycheck) {
          continue;
        }
      } catch (error) {
        console.error('Erro ao validar contracheque existente:', error);
        throw new InternalServerErrorException(
          'Erro ao validar contracheque existente',
        );
      }

      const automation = await this.createAutomationService.execute({
        description: `Contracheque de pensionista - ${data.cpf} | ${this.convertMonth(i)}/${year}`,
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
        await this.changeAutomationStatusToFailed(automation.id, error);
      }
    }
  }

  private async validateExistingPensionerPaycheck(
    data: FindExistingPensionerPaycheckInput,
  ) {
    console.log(data);

    const existingPensionerPaycheck =
      await this.pensionerPaycheckRepository.findExistingPensionerPaycheck(
        data,
      );

    console.log('existingPensionerPaycheck', existingPensionerPaycheck);

    return !!existingPensionerPaycheck;
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
      // eslint-disable-next-line
      error: error?.message || 'Erro ao adicionar job à fila',
    });
  }
}

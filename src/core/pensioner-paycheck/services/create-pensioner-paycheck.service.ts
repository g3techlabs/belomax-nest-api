import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePensionerPaycheckInput } from '../inputs/create-pensioner-paycheck.input';
import { PensionerPaycheckRepository } from '../repositories/pensioner-paycheck.repository';
import { ChangeStatusAutomationService } from 'src/core/automation/services/change-status-automation.service';
import { AutomationStatus } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { WsAutomationsService } from 'src/infrastructure/websocket/automations/automation-websocket.service';

@Injectable()
export class CreatePensionerPaycheckService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pensionerPaycheckRepository: PensionerPaycheckRepository,
    private readonly changeStatusAutomationService: ChangeStatusAutomationService,
    private readonly wsAutomationsService: WsAutomationsService,
  ) {}

  async execute(data: CreatePensionerPaycheckInput) {
    const {
      // registration,
      // bond,
      // cpf,
      // pensionerNumber,
      // month,
      // year,
      // consignableMargin,
      // totalBenefits,
      // netToReceive,
      automationId,
      terms,
    } = data;

    // Validação inicial
    if (!terms || terms.length === 0) {
      throw new BadRequestException(
        'É necessário ao menos um termo para criar o contracheque.',
      );
    }

    // Verifica se a automação existe
    const automation = await this.prisma.automation.findUnique({
      where: { id: automationId },
    });

    if (!automation) {
      throw new NotFoundException('Automação não encontrada.');
    }

    try {
      const created = await this.pensionerPaycheckRepository.create(data);

      await this.changeStatusAutomationService.execute(automationId, {
        status: AutomationStatus.FINISHED,
      });

      this.wsAutomationsService.notifyPensionerPaycheckCreation(
        {
          pensionerPaycheck: created,
          pensionerPaycheckId: created.id,
        },
        automationId,
      );

      return created;
    } catch (error) {
      console.error('Erro ao criar PensionerPaycheck:', error);

      await this.changeStatusAutomationService.execute(automationId, {
        status: AutomationStatus.FAILED,
        // eslint-disable-next-line
        error: error.message || 'Erro inesperado ao criar contracheque.',
      });

      throw new BadRequestException(
        'Erro ao processar contracheque do pensionista.',
      );
    }
  }
}

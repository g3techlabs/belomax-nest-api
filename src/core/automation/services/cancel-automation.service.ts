import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AutomationRepository } from '../repositories/automation.repository';
import { Automation, AutomationStatus } from '@prisma/client';
import { CancelAutomationServiceInput } from '../inputs/cancel-automation.input';
import { FindUserService } from 'src/core/user/services/find-user.service';
import { WsAutomationsService } from 'src/infrastructure/websocket/automations/automation-websocket.service';

@Injectable()
export class CancelAutomationService {
  constructor(
    private readonly automationRepository: AutomationRepository,
    private readonly findUserService: FindUserService,
    private readonly wsAutomationsService: WsAutomationsService,
  ) {}

  async execute(data: CancelAutomationServiceInput): Promise<Automation> {
    const automation = await this.automationRepository.findById(
      data.automationId,
    );

    if (!automation) {
      throw new NotFoundException('Automation not found');
    }

    const user = await this.findUserService.execute(data.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (automation.status === AutomationStatus.FINISHED) {
      throw new BadRequestException('Automation is already finished');
    }

    if (automation.status === AutomationStatus.FAILED) {
      throw new BadRequestException('Automation has already failed');
    }

    if (automation.status === AutomationStatus.CANCELLED) {
      throw new BadRequestException('Automation is already canceled');
    }

    const errorMessage =
      data.error && data.error?.trim() !== ''
        ? `Automação cancelada pelo usuário ${user.name}: ${data.error}`
        : `Automação cancelada pelo usuário ${user.name}`;

    const updatedAutomation = await this.automationRepository.update(
      data.automationId,
      {
        status: AutomationStatus.CANCELLED,
        error: errorMessage,
      },
    );

    this.wsAutomationsService.notifyStatusChange(
      {
        status: AutomationStatus.CANCELLED,
      },
      data.automationId,
      automation?.userId || undefined,
    );

    return updatedAutomation;
  }
}

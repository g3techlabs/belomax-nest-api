import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AutomationRepository } from '../repositories/automation.repository';
import { ChangeStatusAutomationInput } from '../inputs/change-status-automation.input';
import { WsAutomationsService } from 'src/infrastructure/websocket/automations/automation-websocket.service';
import { AutomationStatus } from '@prisma/client';

@Injectable()
export class ChangeStatusAutomationService {
  constructor(
    private readonly automationRepository: AutomationRepository,
    private readonly wsAutomationsService: WsAutomationsService,
  ) {}

  async execute(id: string, data: ChangeStatusAutomationInput): Promise<void> {
    const automation = await this.automationRepository.findById(id);

    if (!automation) {
      throw new NotFoundException('Automation not found');
    }

    if (automation.status === AutomationStatus.FINISHED) {
      throw new BadRequestException(
        'Automation is already finished and cannot be updated',
      );
    }

    if (
      data.status !== AutomationStatus.FAILED &&
      data.error &&
      data.error.trim() !== ''
    ) {
      throw new BadRequestException(
        'Error message should be empty when status is not FAILED',
      );
    }

    if (data.status === AutomationStatus.FAILED && !data.error) {
      throw new BadRequestException(
        'Error message is required when status is FAILED',
      );
    }

    await this.automationRepository.update(id, {
      status: data.status,
      error: data.error,
    });

    this.wsAutomationsService.notifyStatusChange(
      {
        status: data.status,
      },
      id,
      automation?.userId || undefined,
    );
  }
}

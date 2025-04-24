import { Injectable } from '@nestjs/common';
import { AutomationRepository } from '../repositories/automation.repository';
import { CreateAutomationInput } from '../inputs/create-automation.input';
import { Automation } from '@prisma/client';
import { WsAutomationsService } from 'src/infrastructure/websocket/automations/automation-websocket.service';

@Injectable()
export class CreateAutomationService {
  constructor(
    private readonly automationRepository: AutomationRepository,
    private readonly wsAutomationsService: WsAutomationsService,
  ) {}

  async execute(data: CreateAutomationInput): Promise<Automation> {
    const createdAutomation = await this.automationRepository.create(data);

    if (!createdAutomation) {
      throw new Error('Failed to create automation');
    }

    if (createdAutomation?.userId) {
      this.wsAutomationsService.notifyNewAutomation(
        {
          ...createdAutomation,
        },
        createdAutomation?.userId,
      );
    }

    return createdAutomation;
  }
}

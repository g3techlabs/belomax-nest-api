import { Injectable } from '@nestjs/common';
import { AutomationRepository } from '../repositories/automation.repository';
import { CreateAutomationInput } from '../inputs/create-automation.input';
import { Automation } from '@prisma/client';

@Injectable()
export class CreateAutomationService {
  constructor(private readonly automationRepository: AutomationRepository) {}

  async execute(data: CreateAutomationInput): Promise<Automation> {
    return await this.automationRepository.create(data);
  }
}

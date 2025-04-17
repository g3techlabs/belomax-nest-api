import { Injectable } from '@nestjs/common';
import { AutomationRepository } from '../repositories/automation.repository';
import { FindManyAutomationInput } from '../inputs/find-many-automation.input';
import { Automation } from '@prisma/client';

@Injectable()
export class FindManyAutomationService {
  constructor(private readonly automationRepository: AutomationRepository) {}

  async execute(data: FindManyAutomationInput): Promise<Automation[]> {
    return await this.automationRepository.findMany(data);
  }
}

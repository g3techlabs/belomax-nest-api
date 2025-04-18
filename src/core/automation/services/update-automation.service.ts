import { Injectable, NotFoundException } from '@nestjs/common';
import { AutomationRepository } from '../repositories/automation.repository';
import { UpdateAutomationInput } from '../inputs/update-automation.input';
import { Automation } from '@prisma/client';

@Injectable()
export class UpdateAutomationService {
  constructor(private readonly automationRepository: AutomationRepository) {}

  async execute(id: string, data: UpdateAutomationInput): Promise<Automation> {
    const automation = await this.automationRepository.findById(id);

    if (!automation) {
      throw new NotFoundException('Automation not found');
    }

    const updatedAutomation = await this.automationRepository.update(id, data);

    return updatedAutomation;
  }
}

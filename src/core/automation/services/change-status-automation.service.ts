import { Injectable, NotFoundException } from '@nestjs/common';
import { AutomationRepository } from '../repositories/automation.repository';
import { ChangeStatusAutomationInput } from '../inputs/change-status-automation.input';

@Injectable()
export class ChangeStatusAutomationService {
  constructor(private readonly automationRepository: AutomationRepository) {}

  async execute(id: string, data: ChangeStatusAutomationInput): Promise<void> {
    const automation = await this.automationRepository.findById(id);

    if (!automation) {
      throw new NotFoundException('Automation not found');
    }

    await this.automationRepository.update(id, { status: data.status });
  }
}

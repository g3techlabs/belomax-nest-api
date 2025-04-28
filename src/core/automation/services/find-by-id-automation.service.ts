import { Injectable, NotFoundException } from '@nestjs/common';
import { AutomationRepository } from '../repositories/automation.repository';

@Injectable()
export class FindByIdAutomationService {
  constructor(private readonly automationRepository: AutomationRepository) {}

  async execute(id: string) {
    const automation = await this.automationRepository.findById(id);

    if (!automation) {
      throw new NotFoundException('Automation not found');
    }

    return automation;
  }
}

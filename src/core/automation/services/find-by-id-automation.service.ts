import { Injectable, NotFoundException } from '@nestjs/common';
import { AutomationRepository } from '../repositories/automation.repository';
import { Automation } from '@prisma/client';

@Injectable()
export class FindByIdAutomationService {
  constructor(private readonly automationRepository: AutomationRepository) {}

  async execute(id: string): Promise<Automation> {
    const automation = await this.automationRepository.findById(id);

    if (!automation) {
      throw new NotFoundException('Automation not found');
    }

    return automation;
  }
}

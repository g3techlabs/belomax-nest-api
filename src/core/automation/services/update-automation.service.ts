import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AutomationRepository } from '../repositories/automation.repository';
import { UpdateAutomationInput } from '../inputs/update-automation.input';
import { Automation, AutomationStatus } from '@prisma/client';

@Injectable()
export class UpdateAutomationService {
  constructor(private readonly automationRepository: AutomationRepository) {}

  async execute(id: string, data: UpdateAutomationInput): Promise<Automation> {
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

    const updatedAutomation = await this.automationRepository.update(id, data);

    return updatedAutomation;
  }
}

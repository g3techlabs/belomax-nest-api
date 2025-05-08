import { Injectable } from '@nestjs/common';
import { AutomationRepository } from '../repositories/automation.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly automationRepository: AutomationRepository) {}

  async getDashboardStats() {
    const automationStats =
      await this.automationRepository.getAutomationStats();
    const statementExtractStats =
      await this.automationRepository.getStatementExtractStats();
    const documentStats = await this.automationRepository.getDocumentStats();
    const customerStats = await this.automationRepository.getCustomerStats();

    return {
      automationStats,
      statementExtractStats,
      documentStats,
      customerStats,
    };
  }
}

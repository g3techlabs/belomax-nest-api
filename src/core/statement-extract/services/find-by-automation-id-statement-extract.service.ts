import { StatementExtract } from '@prisma/client';
import { StatementExtractRepository } from '../repositories/statement-extract.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FindByAutomationIdStatementExtractService {
  constructor(
    private readonly statementExtractRepository: StatementExtractRepository,
  ) {}

  async execute(automationId: string): Promise<StatementExtract> {
    const statementExtract =
      await this.statementExtractRepository.findStatementExtractByAutomationId(
        automationId,
      );

    if (!statementExtract) {
      throw new NotFoundException('Statement extracts not found');
    }

    return statementExtract;
  }
}

import { Injectable } from '@nestjs/common';
import { StatementExtractRepository } from '../repositories/statement-extract.repository';

@Injectable()
export class CountStatementExtractExpectedDocumentsService {
  constructor(
    private readonly statementExtractRepository: StatementExtractRepository,
  ) {}

  async execute(automationId: string): Promise<number> {
    const findStatementExtract =
      await this.statementExtractRepository.findStatementExtractByAutomationId(
        automationId,
      );

    if (!findStatementExtract) {
      throw new Error('Statement extract not found');
    }

    const termsCount = findStatementExtract.selectedTerms.length;

    const baseDocumentsCount = 1;
    const filterDocumentsCount = termsCount;
    const highlightDocumentsCount = termsCount;

    const count =
      baseDocumentsCount + filterDocumentsCount + highlightDocumentsCount;

    return count;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { StatementExtractRepository } from '../repositories/statement-extract.repository';
import { UpdateStatementExtractInput } from '../inputs/update-statement-extract.input';
import { StatementExtract } from '@prisma/client';

@Injectable()
export class UpdateStatementExtractService {
  constructor(
    private readonly statementExtractRepository: StatementExtractRepository,
  ) {}

  async execute(
    id: string,
    data: UpdateStatementExtractInput,
  ): Promise<StatementExtract> {
    const statementExtract = await this.statementExtractRepository.findById(id);

    if (!statementExtract) {
      throw new NotFoundException('StatementExtract not found');
    }
    return await this.statementExtractRepository.update(id, data);
  }
}

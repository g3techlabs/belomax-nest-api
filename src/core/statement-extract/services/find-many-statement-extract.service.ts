import { Injectable } from '@nestjs/common';
import { StatementExtractRepository } from '../repositories/statement-extract.repository';
import { StatementExtract } from '@prisma/client';
import { FindManyStatementExtractInput } from '../inputs/find-many-statement-extract.input';

@Injectable()
export class FindManyStatementExtractService {
  constructor(
    private readonly statementExtractRepository: StatementExtractRepository,
  ) {}

  async execute(
    data: FindManyStatementExtractInput,
  ): Promise<StatementExtract[]> {
    return await this.statementExtractRepository.findMany(data);
  }
}

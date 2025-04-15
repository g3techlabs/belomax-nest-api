import { Injectable } from '@nestjs/common';
import { StatementExtractRepository } from '../repositories/statement-extract.repository';
import { CreateStatementExtractInput } from '../inputs/create-statement-extract.input';
import { StatementExtract } from '@prisma/client';

@Injectable()
export class CreateStatementExtractService {
  constructor(
    private readonly statementExtractRepository: StatementExtractRepository,
  ) {}

  async execute(data: CreateStatementExtractInput): Promise<StatementExtract> {
    return await this.statementExtractRepository.create(data);
  }
}

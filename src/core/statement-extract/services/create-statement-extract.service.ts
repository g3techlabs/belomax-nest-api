import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { StatementExtractRepository } from '../repositories/statement-extract.repository';
import { CreateStatementExtractServiceInput } from '../inputs/create-statement-extract.input';
// import { StatementExtract } from '@prisma/client';
import { FindUserService } from '../../user/services/find-user.service';
import { StatementTermRepository } from '../repositories/statement-term.repository';
import { CreateAutomationService } from '../../automation/services/create-automation.service';
import { CreateDocumentService } from '../../document/services/create-document.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { StatementExtract } from '@prisma/client';

@Injectable()
export class CreateStatementExtractService {
  constructor(
    private readonly statementExtractRepository: StatementExtractRepository,
    private readonly statementTermRepository: StatementTermRepository,
    private readonly findUserService: FindUserService,
    private readonly createAutomationService: CreateAutomationService,
    private readonly createDocumentService: CreateDocumentService,
    @InjectQueue('belomax-python-queue') private readonly belomaxQueue: Queue,
  ) {}

  async execute(
    data: CreateStatementExtractServiceInput,
  ): Promise<StatementExtract> {
    const { bank, selectedTerms, userId, file, token } = data;

    const userExists = await this.findUserService.execute(userId);

    if (!userExists) {
      throw new BadRequestException('User not found');
    }

    const selectedTermsDescription: string[] = [];

    for (const termId of selectedTerms) {
      const termExists = await this.statementTermRepository.findById(termId);

      if (!termExists) {
        throw new BadRequestException(`Term with ID ${termId} not found`);
      }

      selectedTermsDescription.push(termExists.description);
    }

    const automation = await this.createAutomationService.execute({
      description: `Extração de termos de extrato do banco ${bank}`,
      userId,
    });

    if (!automation) {
      throw new NotImplementedException('Failed to create automation');
    }

    const fileData = await this.createDocumentService.execute({
      name: `${automation.id}-${new Date().toISOString()}-${file.originalname}`,
      file: file,
      automationId: automation.id,
    });

    const queueData = {
      fileAwsName: fileData.name,
      automationId: automation.id,
      bank,
      terms: selectedTermsDescription,
      authToken: token,
    };

    await this.belomaxQueue.add('new-statement-extract', queueData);

    return await this.statementExtractRepository.create({
      ...data,
      automationId: automation.id,
    });
  }
}

import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { StatementExtractController } from './controllers/statement-extract.controller';
import { StatementExtractRepository } from './repositories/statement-extract.repository';
import { CreateStatementExtractService } from './services/create-statement-extract.service';
import { FindManyStatementExtractService } from './services/find-many-statement-extract.service';
import { FindByIdStatementExtractService } from './services/find-by-id-statement-extract.service';
import { UpdateStatementExtractService } from './services/update-statement-extract.service';

@Module({
  imports: [DatabaseModule],
  controllers: [StatementExtractController],
  providers: [
    StatementExtractRepository,
    CreateStatementExtractService,
    FindManyStatementExtractService,
    FindByIdStatementExtractService,
    UpdateStatementExtractService,
  ],
})
export class StatementExtractModule {}

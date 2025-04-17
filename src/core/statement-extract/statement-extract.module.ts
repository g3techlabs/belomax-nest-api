import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { StatementExtractController } from './controllers/statement-extract.controller';
import { StatementExtractRepository } from './repositories/statement-extract.repository';
import { CreateStatementExtractService } from './services/create-statement-extract.service';
import { FindManyStatementExtractService } from './services/find-many-statement-extract.service';
import { FindByIdStatementExtractService } from './services/find-by-id-statement-extract.service';
import { UpdateStatementExtractService } from './services/update-statement-extract.service';
import { StatementTermController } from './controllers/statement-term.controller';
import { StatementTermRepository } from './repositories/statement-term.repository';
import { CreateStatementTermsService } from './services/create-statement-terms.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [StatementExtractController, StatementTermController],
  providers: [
    StatementExtractRepository,
    CreateStatementExtractService,
    FindManyStatementExtractService,
    FindByIdStatementExtractService,
    UpdateStatementExtractService,
    StatementTermRepository,
    CreateStatementTermsService,
  ],
})
export class StatementExtractModule {}

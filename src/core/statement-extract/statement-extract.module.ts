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
import { AutomationModule } from '../automation/automation.module';
import { UserModule } from '../user/user.module';
import { DocumentModule } from '../document/document.module';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from 'src/auth/auth.module';
import { AwsModule } from 'src/infrastructure/aws/aws.module';
import { PythonApiModule } from 'src/infrastructure/api/python-api/python-api.module';
import { FindExtractTermsService } from './services/extract-terms.service';
import { WebsocketModule } from 'src/infrastructure/websocket/websocket.module';
import { FindUniqueStatementTermService } from './services/find-unique-statement-term.service';
import { FindManyStatementTermByBankService } from './services/find-many-statement-term-by-bank.service';

@Module({
  imports: [
    DatabaseModule,
    AutomationModule,
    UserModule,
    DocumentModule,
    BullModule.registerQueue({
      name: 'belomax-python-queue',
    }),
    AuthModule,
    AwsModule,
    PythonApiModule,
    WebsocketModule,
  ],
  controllers: [StatementExtractController, StatementTermController],
  providers: [
    StatementExtractRepository,
    CreateStatementExtractService,
    FindManyStatementExtractService,
    FindByIdStatementExtractService,
    UpdateStatementExtractService,
    CreateStatementTermsService,

    StatementTermRepository,
    FindExtractTermsService,
    FindUniqueStatementTermService,
    FindManyStatementTermByBankService,
  ],
})
export class StatementExtractModule {}

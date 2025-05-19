import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { PensionerPaycheckRepository } from './repositories/pensioner-paycheck.repository';
import { TriggerPensionerPaycheckAutomationService } from './services/trigger-pensioner-paycheck-automation.service';
import { BullModule } from '@nestjs/bullmq';
import { CreatePensionerPaycheckService } from './services/create-pensioner-paycheck.service';
import { AutomationModule } from '../automation/automation.module';
import { CustomerModule } from '../customer/customer.module';
import { UserModule } from '../user/user.module';
import { WebsocketModule } from 'src/infrastructure/websocket/websocket.module';
import { PensionerPaycheckController } from './controllers/pensioner-paycheck.controller';
import { FindManyPensionerPaycheckService } from './services/find-many-pensioner-paycheck.service';
import { FindByIdPensionerPaycheckService } from './services/find-by-id-pensioner-paycheck.service';
import { GeneratePensionerEarningsReportService } from './services/generate-pensioner-earnings-report.service';
import { DocumentModule } from '../document/document.module';
import { MergeAllPensionerReportsService } from './services/merge-all-pensioner-reports.service';
import { AwsModule } from 'src/infrastructure/aws/aws.module';

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({
      name: 'belomax-python-queue',
    }),
    BullModule.registerQueue({
      name: 'belomax-queue',
    }),
    AutomationModule,
    CustomerModule,
    UserModule,
    WebsocketModule,
    DocumentModule,
    AwsModule
  ],
  controllers: [PensionerPaycheckController],
  providers: [
    PensionerPaycheckRepository,
    TriggerPensionerPaycheckAutomationService,
    CreatePensionerPaycheckService,
    FindManyPensionerPaycheckService,
    FindByIdPensionerPaycheckService,
    GeneratePensionerEarningsReportService,
    MergeAllPensionerReportsService
  ],
  exports: [GeneratePensionerEarningsReportService]
})
export class PensionerPaycheckModule {}

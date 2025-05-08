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

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({
      name: 'belomax-python-queue',
    }),
    AutomationModule,
    CustomerModule,
    UserModule,
    WebsocketModule,
  ],
  controllers: [],
  providers: [
    PensionerPaycheckRepository,
    TriggerPensionerPaycheckAutomationService,
    CreatePensionerPaycheckService,
  ],
})
export class PensionerPaycheckModule {}

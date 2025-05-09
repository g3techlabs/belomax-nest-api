/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { AutomationController } from './controllers/automation.controller';
import { AutomationRepository } from './repositories/automation.repository';
import { CreateAutomationService } from './services/create-automation.service';
import { FindManyAutomationService } from './services/find-many-automation.service';
import { FindByIdAutomationService } from './services/find-by-id-automation.service';
import { UpdateAutomationService } from './services/update-automation.service';
import { AuthModule } from 'src/auth/auth.module';
import { ChangeStatusAutomationService } from './services/change-status-automation.service';
import { WebsocketModule } from 'src/infrastructure/websocket/websocket.module';
import { UserModule } from '../user/user.module';
import { CancelAutomationService } from './services/cancel-automation.service';
import { DashboardService } from './services/dashboard.service';

@Module({
  imports: [DatabaseModule, AuthModule, WebsocketModule, UserModule],
  controllers: [AutomationController],
  providers: [
    // Repositories
    AutomationRepository,
    // Services
    CreateAutomationService,
    FindManyAutomationService,
    FindByIdAutomationService,
    UpdateAutomationService,
    ChangeStatusAutomationService,
    CancelAutomationService,
    DashboardService,
  ],
  exports: [
    CreateAutomationService,
    UpdateAutomationService,
    FindByIdAutomationService,
    ChangeStatusAutomationService,
  ],
})
export class AutomationModule {}

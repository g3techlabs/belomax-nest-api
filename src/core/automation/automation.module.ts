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

@Module({
  imports: [DatabaseModule],
  controllers: [AutomationController],
  providers: [
    // Repositories
    AutomationRepository,
    // Services
    CreateAutomationService,
    FindManyAutomationService,
    FindByIdAutomationService,
    UpdateAutomationService,
  ],
  exports: [CreateAutomationService, FindByIdAutomationService],
})
export class AutomationModule {}

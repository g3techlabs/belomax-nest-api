import { AutomationStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ChangeStatusAutomationInput {
  @IsEnum(AutomationStatus)
  status: AutomationStatus;
}

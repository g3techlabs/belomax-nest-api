import { AutomationStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ChangeStatusAutomationInput {
  @IsEnum(AutomationStatus)
  status: AutomationStatus;

  @IsString()
  @IsOptional()
  error?: string;
}

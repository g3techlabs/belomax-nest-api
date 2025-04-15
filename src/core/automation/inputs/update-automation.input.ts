import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AutomationStatus } from '@prisma/client';

export class UpdateAutomationInput {
  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(AutomationStatus)
  @IsOptional()
  status?: AutomationStatus;
}

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AutomationStatus } from '@prisma/client';

export class CreateAutomationInput {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(AutomationStatus)
  @IsOptional()
  status?: AutomationStatus;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  customerId?: string;
}

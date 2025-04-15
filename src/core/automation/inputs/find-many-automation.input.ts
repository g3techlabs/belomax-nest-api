import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { AutomationStatus } from '@prisma/client';

export class FindManyAutomationInput {
  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(AutomationStatus)
  @IsOptional()
  status?: AutomationStatus;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}

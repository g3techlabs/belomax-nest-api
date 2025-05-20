import { AutomationStatus } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsInstance,
  IsOptional,
  IsString,
} from 'class-validator';

class DateInterval {
  @IsDate()
  @IsOptional()
  start?: Date;

  @IsDate()
  @IsOptional()
  end?: Date;
}

export class FindManyStatementExtractInput {
  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsEnum(AutomationStatus)
  @IsOptional()
  status?: AutomationStatus;

  @IsInstance(DateInterval)
  @IsOptional()
  dateInterval?: DateInterval;

  @IsString()
  @IsOptional()
  term?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

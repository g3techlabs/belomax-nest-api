import { AutomationStatus, PensionerPaycheckTermType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export class FindManyPensionerPaycheckInput {
  @IsString()
  @IsOptional()
  discrimination?: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  code?: number;

  @IsEnum(PensionerPaycheckTermType)
  @IsOptional()
  type?: PensionerPaycheckTermType;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  minValue?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  maxValue?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  minConsignableMargin?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  maxConsignableMargin?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  minNetToReceive?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  maxNetToReceive?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  initialMonth?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  initialYear?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  finalMonth?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  finalYear?: number;

  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsEnum(AutomationStatus)
  @IsOptional()
  status?: AutomationStatus;
}

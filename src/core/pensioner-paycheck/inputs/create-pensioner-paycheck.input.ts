import { TriggerUniquePensionerPaycheckAutomationInput } from './trigger-pensioner-paycheck-automation.input';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePensionerPaycheckTermInput } from './create-pensioner-paycheck-term.input';
import { IntersectionType, OmitType } from '@nestjs/swagger';

export class CreatePensionerPaycheckInput extends IntersectionType(
  OmitType(TriggerUniquePensionerPaycheckAutomationInput, ['customerId']),
  Object,
) {
  @IsNumber()
  consignableMargin: number;

  @IsNumber()
  totalBenefits: number;

  @IsNumber()
  netToReceive: number;

  @IsString()
  automationId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePensionerPaycheckTermInput)
  terms: CreatePensionerPaycheckTermInput[];
}

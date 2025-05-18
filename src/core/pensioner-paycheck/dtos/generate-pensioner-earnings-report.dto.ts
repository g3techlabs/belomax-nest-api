import { OmitType } from '@nestjs/swagger';
import { TriggerUniquePensionerPaycheckAutomationInput } from '../inputs/trigger-pensioner-paycheck-automation.input';

export class GeneratePensionerEarningsReportDTO extends OmitType(
  TriggerUniquePensionerPaycheckAutomationInput,
  ['customerId', 'initialMonth', 'initialYear', 'finalMonth', 'finalYear'],
) {
  month: number
  year: number
  customerName: string;
  automationId: string;
}

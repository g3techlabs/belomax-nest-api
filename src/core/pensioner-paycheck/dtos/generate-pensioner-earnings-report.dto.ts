import { OmitType } from '@nestjs/swagger';
import { TriggerUniquePensionerPaycheckAutomationInput } from '../inputs/trigger-pensioner-paycheck-automation.input';

export class GeneratePensionerEarningsReportDTO extends OmitType(
  TriggerUniquePensionerPaycheckAutomationInput,
  ['customerId'],
) {
  customerName: string;
  automationId: string;
}

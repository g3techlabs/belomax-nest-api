import { PensionerPaycheck } from '@prisma/client';

export class WsAutomationPensionerPaycheckCreationInput {
  pensionerPaycheckId: string;
  pensionerPaycheck: PensionerPaycheck;
}

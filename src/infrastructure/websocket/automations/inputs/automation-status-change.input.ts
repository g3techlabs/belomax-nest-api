import { AutomationStatus } from '@prisma/client';

export class WsAutomationStatusChangeInput {
  status: AutomationStatus;
}

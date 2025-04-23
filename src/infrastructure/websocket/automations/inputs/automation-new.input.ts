import { AutomationStatus } from '@prisma/client';

export class WsAutomationNewInput {
  automationId: string;
  status: AutomationStatus;
  description: string;
  userId: string;
  customerId?: string;
  createdAt: string;
}

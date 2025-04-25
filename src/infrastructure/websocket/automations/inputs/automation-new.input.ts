import { AutomationStatus, Document } from '@prisma/client';

export class WsAutomationNewInput {
  automationId: string;
  status: AutomationStatus;
  description: string;
  customerId?: string;
  createdAt: Date;
  documents: Document[];
}

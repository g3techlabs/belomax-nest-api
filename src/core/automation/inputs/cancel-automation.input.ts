export class CancelAutomationRequestInput {
  error?: string;
}

export class CancelAutomationServiceInput {
  error?: string;
  userId: string;
  automationId: string;
}

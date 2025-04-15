import { Automation } from '@prisma/client';

export class FindManyAutomationDto {
  automations: Automation[];
  totalCount: number;
}

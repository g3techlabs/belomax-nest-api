import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { CreateAutomationInput } from '../inputs/create-automation.input';
import { UpdateAutomationInput } from '../inputs/update-automation.input';
import { FindManyAutomationInput } from '../inputs/find-many-automation.input';
import { Automation } from '@prisma/client';

@Injectable()
export class AutomationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAutomationInput): Promise<Automation> {
    return await this.prisma.automation.create({ data });
  }

  async findMany(data: FindManyAutomationInput): Promise<Automation[]> {
    return await this.prisma.automation.findMany({
      where: {
        description: data.description
          ? { contains: data.description, mode: 'insensitive' }
          : undefined,
        status: data.status,
      },
      take: data.limit,
      skip: data.page ? (data.page - 1) * data.limit : undefined,
    });
  }

  async findById(id: string): Promise<Automation | null> {
    return await this.prisma.automation.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateAutomationInput): Promise<Automation> {
    return await this.prisma.automation.update({
      where: { id },
      data,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { CreateAutomationInput } from '../inputs/create-automation.input';
import { UpdateAutomationInput } from '../inputs/update-automation.input';
import { FindManyAutomationInput } from '../inputs/find-many-automation.input';
import { Automation, AutomationStatus } from '@prisma/client';

@Injectable()
export class AutomationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAutomationInput): Promise<Automation> {
    const { description, userId, customerId } = data;

    return await this.prisma.automation.create({
      data: {
        description,
        user: userId
          ? {
              connect: {
                id: userId,
              },
            }
          : undefined,
        customer: customerId
          ? {
              connect: {
                id: data.customerId,
              },
            }
          : undefined,
      },
    });
  }

  async findMany(data: FindManyAutomationInput): Promise<Automation[]> {
    const { page, limit, description, status } = data;

    return await this.prisma.automation.findMany({
      where: {
        description: description
          ? { contains: description, mode: 'insensitive' }
          : undefined,
        status: status ? { equals: status } : undefined,
      },
      take: limit || undefined,
      skip: page && limit ? (page - 1) * limit : undefined,
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

  async changeStatus(
    id: string,
    status: AutomationStatus,
  ): Promise<Automation> {
    return await this.prisma.automation.update({
      where: { id },
      data: { status },
    });
  }
}

// health.controller.ts
import {
  HealthCheckService,
  HealthCheck,
  HealthIndicatorResult,
  HealthCheckResult,
} from '@nestjs/terminus';
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> => {
        await this.prisma.$queryRaw`SELECT 1`;
        return {
          prisma: {
            status: 'up',
          },
        };
      },
    ]);
  }
}
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateAutomationInput } from '../inputs/create-automation.input';
import { FindManyAutomationInput } from '../inputs/find-many-automation.input';
import { CreateAutomationService } from '../services/create-automation.service';
import { FindByIdAutomationService } from '../services/find-by-id-automation.service';
import { FindManyAutomationService } from '../services/find-many-automation.service';
import { UpdateAutomationService } from '../services/update-automation.service';
import { UpdateAutomationInput } from '../inputs/update-automation.input';
import { Automation, User } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { ChangeStatusAutomationInput } from '../inputs/change-status-automation.input';
import { ChangeStatusAutomationService } from '../services/change-status-automation.service';
import { CancelAutomationRequestInput } from '../inputs/cancel-automation.input';
import { CurrentUser } from 'src/auth/current-user';
import { CancelAutomationService } from '../services/cancel-automation.service';
import { DashboardService } from '../services/dashboard.service';

@Controller('automations')
export class AutomationController {
  constructor(
    private readonly createAutomationService: CreateAutomationService,
    private readonly findManyAutomationService: FindManyAutomationService,
    private readonly findByIdAutomationService: FindByIdAutomationService,
    private readonly updateAutomationService: UpdateAutomationService,
    private readonly changeStatusAutomationService: ChangeStatusAutomationService,
    private readonly cancelAutomationService: CancelAutomationService,
    private readonly dashboardService: DashboardService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  async getDashboardStats() {
    return await this.dashboardService.getDashboardStats();
  }

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateAutomationInput): Promise<Automation> {
    return await this.createAutomationService.execute(data);
  }

  @UseGuards(AuthGuard)
  @Put()
  @HttpCode(HttpStatus.OK)
  async findMany(@Body() data: FindManyAutomationInput): Promise<Automation[]> {
    return await this.findManyAutomationService.execute(data);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<Automation> {
    return await this.findByIdAutomationService.execute(id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateAutomationInput,
  ): Promise<Automation> {
    return await this.updateAutomationService.execute(id, data);
  }

  @UseGuards(AuthGuard)
  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  async changeStatus(
    @Param('id') id: string,
    @Body() data: ChangeStatusAutomationInput,
  ) {
    return await this.changeStatusAutomationService.execute(id, data);
  }

  @UseGuards(AuthGuard)
  @Put(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelAutomation(
    @Param('id') id: string,
    @Body() data: CancelAutomationRequestInput,
    @CurrentUser() user: User, // Replace 'any' with the actual type of the user
  ) {
    return await this.cancelAutomationService.execute({
      automationId: id,
      userId: user.id,
      error: data.error,
    });
  }
}

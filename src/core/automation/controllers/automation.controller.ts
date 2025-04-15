import {
  Body,
  Controller,
  Get,
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
import { Automation } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('automations')
export class AutomationController {
  constructor(
    private readonly createAutomationService: CreateAutomationService,
    private readonly findManyAutomationService: FindManyAutomationService,
    private readonly findByIdAutomationService: FindByIdAutomationService,
    private readonly updateAutomationService: UpdateAutomationService,
  ) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  async create(@Body() data: CreateAutomationInput): Promise<Automation> {
    return await this.createAutomationService.execute(data);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get()
  async findMany(@Body() data: FindManyAutomationInput): Promise<Automation[]> {
    return await this.findManyAutomationService.execute(data);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Automation> {
    return await this.findByIdAutomationService.execute(id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateAutomationInput,
  ): Promise<Automation> {
    return await this.updateAutomationService.execute(id, data);
  }
}

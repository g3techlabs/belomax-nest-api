import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/current-user';
import { TriggerPensionerPaycheckAutomationService } from '../services/trigger-pensioner-paycheck-automation.service';
import { TriggerUniquePensionerPaycheckAutomationInput } from '../inputs/trigger-pensioner-paycheck-automation.input';
import { CreatePensionerPaycheckService } from '../services/create-pensioner-paycheck.service';
import { CreatePensionerPaycheckInput } from '../inputs/create-pensioner-paycheck.input';
import { FindManyPensionerPaycheckInput } from '../inputs/find-many-pensioner-paycheck.input';
import { FindManyPensionerPaycheckService } from '../services/find-many-pensioner-paycheck.service';

@Controller('pensioner-paychecks')
export class PensionerPaycheckController {
  constructor(
    private readonly triggerPensionerPaycheckAutomationService: TriggerPensionerPaycheckAutomationService,
    private readonly createPensionerPaycheckService: CreatePensionerPaycheckService,
    private readonly findManyPensionerPaycheckService: FindManyPensionerPaycheckService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('trigger')
  @HttpCode(HttpStatus.CREATED)
  async triggerAutomation(
    @CurrentUser() user: User,
    @Headers('Authorization') token: string,
    @Body() data: TriggerUniquePensionerPaycheckAutomationInput,
  ) {
    return await this.triggerPensionerPaycheckAutomationService.execute(
      user.id,
      token,
      {
        ...data,
      },
    );
  }

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreatePensionerPaycheckInput) {
    return await this.createPensionerPaycheckService.execute({
      ...data,
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findMany(@Query() data: FindManyPensionerPaycheckInput) {
    return await this.findManyPensionerPaycheckService.execute(data);
  }
}

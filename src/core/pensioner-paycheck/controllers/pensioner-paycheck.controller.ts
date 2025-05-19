import { MergeAllPensionerReportsService } from './../services/merge-all-pensioner-reports.service';
import { MergeAllPensionerReportsInput } from './../inputs/merge-all-pensioner-reports.input';
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
  Param,
  Res,
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
import { FindByIdPensionerPaycheckService } from '../services/find-by-id-pensioner-paycheck.service';
import { Response } from 'express';

@Controller('pensioner-paychecks')
export class PensionerPaycheckController {
  constructor(
    private readonly triggerPensionerPaycheckAutomationService: TriggerPensionerPaycheckAutomationService,
    private readonly createPensionerPaycheckService: CreatePensionerPaycheckService,
    private readonly findManyPensionerPaycheckService: FindManyPensionerPaycheckService,
    private readonly findByIdPensionerPaycheckService: FindByIdPensionerPaycheckService,
    private readonly mergeAllPensionerReportsService: MergeAllPensionerReportsService 
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

  @UseGuards(AuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string) {
    return await this.findByIdPensionerPaycheckService.execute(id);
  }

  @UseGuards(AuthGuard)
  @Post('merge-files')
  async mergeAllPensionerReports(@Body() data: MergeAllPensionerReportsInput, @Res() response: Response) {
    const file = await this.mergeAllPensionerReportsService.execute(data)

    if (!file) return response.status(204).send()

    response.setHeader('Content-Type', 'application/zip');
    response.setHeader('Content-Disposition', `attachment; filename=output.pdf`);

    file.pipe(response)
  }
}

import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/current-user';
import { TriggerPensionerPaycheckAutomationService } from '../services/trigger-pensioner-paycheck-automation.service';
import { TriggerUniquePensionerPaycheckAutomationInput } from '../inputs/trigger-pensioner-paycheck-automation.input';

@Controller('pensioner-paychecks')
export class PensionerPaycheckController {
  constructor(
    private readonly triggerPensionerPaycheckAutomationService: TriggerPensionerPaycheckAutomationService,
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
}

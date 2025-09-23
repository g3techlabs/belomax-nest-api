import { GeneratePensionerEarningsReportDTO } from './../../../core/pensioner-paycheck/dtos/generate-pensioner-earnings-report.dto';
import { GeneratePensionerEarningsReportService } from '../../../core/pensioner-paycheck/services/generate-pensioner-earnings-report.service';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';

@Injectable()
export class GeneratePensionerEarningsReportConsumer {
  constructor(
    private readonly generatePensionerEarningsReportService: GeneratePensionerEarningsReportService,
  ) {}

  async execute(job: Job<GeneratePensionerEarningsReportDTO>) {
    await this.generatePensionerEarningsReportService.execute(job.data);

    return {};
  }
}

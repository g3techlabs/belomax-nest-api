import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { HighlightPdfTermsInput } from 'src/core/statement-extract/inputs/highlight-pdf-terms.input';
import { HighlightPdfTermsService } from 'src/core/statement-extract/services/highlight-pdf-terms.service';

@Injectable()
export class HighlightPdfTermsConsumer {
  constructor(
    private readonly highlightPdfTermsService: HighlightPdfTermsService,
  ) {}

  async execute(job: Job<HighlightPdfTermsInput>) {
    await this.highlightPdfTermsService.execute(job.data);

    return {};
  }
}

import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { HighlightPdfTermInput } from 'src/core/statement-extract/inputs/highlight-pdf-term.input';
import { HighlightPdfTermService } from 'src/core/statement-extract/services/highlight-pdf-term.service';

@Injectable()
export class HighlightPdfTermsConsumer {
  constructor(
    private readonly highlightPdfTermService: HighlightPdfTermService,
  ) {}

  async execute(job: Job<HighlightPdfTermInput>) {
    await this.highlightPdfTermService.execute(job.data);

    return {};
  }
}

import { HighlightPdfTermsConsumer } from './consumers/highlight-pdf-terms.consumer';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SendWelcomeEmailConsumer } from './consumers/send-welcome-email.consumer';
import { SendTokenEmailConsumer } from './consumers/send-token-email.consumer';

@Processor('belomax-queue')
export class QueueService extends WorkerHost {
  constructor(
    private readonly sendWelcomeEmailConsumer: SendWelcomeEmailConsumer,
    private readonly sendTokenEmailConsumer: SendTokenEmailConsumer,
    private readonly highlightPdfTermsConsumer: HighlightPdfTermsConsumer,
  ) {
    super();
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    const logger = new Logger('QueueService');
    logger.log(`Processing job ${job.id} of type ${job.name} `);
  }

  async process(job: Job) {
    switch (job.name) {
      case 'send-welcome-email':
        await this.sendWelcomeEmailConsumer.execute(job);
        break;
      case 'send-token-email':
        await this.sendTokenEmailConsumer.execute(job);
        break;
      case 'highlight-pdf-terms':
        await this.highlightPdfTermsConsumer.execute(job);
    }

    return {};
  }
}

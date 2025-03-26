import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('token-email')
export class TokenEmailConsumer extends WorkerHost {
  @OnWorkerEvent('active')
  onActive(job: Job) {
    const logger = new Logger('TokenEmailConsumer');
    logger.log(`Processing job ${job.id} of type ${job.name} `);
  }

  async process(job: Job) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(job.data);
    // Send email to user with token
    return {};
  }
}

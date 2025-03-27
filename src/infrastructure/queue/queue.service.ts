import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SendCredentialsEmailConsumer } from './consumers/send-credentials-email.consumer';

@Processor('users-queue')
export class QueueService extends WorkerHost {
  constructor(
    private readonly sendCredentialsEmailConsumer: SendCredentialsEmailConsumer,
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
      case 'send-credentials-email':
        await this.sendCredentialsEmailConsumer.execute(job);
        break;
    }

    return {};
  }
}

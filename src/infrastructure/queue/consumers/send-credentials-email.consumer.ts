import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { CredentialsEmail } from '../../mail/emails/credentials.email';
import { CredentialsInput } from 'src/infrastructure/mail/input/credentials.input';

@Injectable()
export class SendCredentialsEmailConsumer {
  constructor(private readonly credentialsEmail: CredentialsEmail) {}

  async execute(job: Job<CredentialsInput>) {
    await this.credentialsEmail.send({
      email: job.data.email,
      password: job.data.password,
    });

    return {};
  }
}

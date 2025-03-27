import { Module } from '@nestjs/common';
// import { TokenEmailConsumer } from './consumers/send-token-email.consumer';
import { SendCredentialsEmailConsumer } from './consumers/send-credentials-email.consumer';
import { QueueService } from './queue.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [],
  providers: [SendCredentialsEmailConsumer, QueueService],
  exports: [SendCredentialsEmailConsumer],
})
export class QueueModule {}

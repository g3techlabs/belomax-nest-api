import { Module } from '@nestjs/common';
// import { TokenEmailConsumer } from './consumers/send-token-email.consumer';
import { SendCredentialsEmailConsumer } from './consumers/send-credentials-email.consumer';
import { QueueService } from './queue.service';
import { MailModule } from '../mail/mail.module';
import { SendTokenEmailConsumer } from './consumers/token-email.consumer';

@Module({
  imports: [MailModule],
  controllers: [],
  providers: [SendCredentialsEmailConsumer, QueueService, SendTokenEmailConsumer],
  exports: [SendCredentialsEmailConsumer],
})
export class QueueModule {}

import { Module } from '@nestjs/common';
// import { TokenEmailConsumer } from './consumers/send-token-email.consumer';
import { SendWelcomeEmailConsumer } from './consumers/send-welcome-email.consumer';
import { QueueService } from './queue.service';
import { MailModule } from '../mail/mail.module';
import { SendTokenEmailConsumer } from './consumers/send-token-email.consumer';

@Module({
  imports: [MailModule],
  controllers: [],
  providers: [SendWelcomeEmailConsumer, QueueService, SendTokenEmailConsumer],
  exports: [SendWelcomeEmailConsumer],
})
export class QueueModule {}

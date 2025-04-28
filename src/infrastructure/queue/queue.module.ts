import { Module } from '@nestjs/common';
// import { TokenEmailConsumer } from './consumers/send-token-email.consumer';
import { SendWelcomeEmailConsumer } from './consumers/send-welcome-email.consumer';
import { QueueService } from './queue.service';
import { MailModule } from '../mail/mail.module';
import { SendTokenEmailConsumer } from './consumers/send-token-email.consumer';
import { HighlightPdfTermsConsumer } from './consumers/highlight-pdf-terms.consumer';
import { StatementExtractModule } from 'src/core/statement-extract/statement-extract.module';

@Module({
  imports: [MailModule, StatementExtractModule],
  controllers: [],
  providers: [SendWelcomeEmailConsumer, QueueService, SendTokenEmailConsumer, HighlightPdfTermsConsumer],
  exports: [SendWelcomeEmailConsumer],
})
export class QueueModule {}

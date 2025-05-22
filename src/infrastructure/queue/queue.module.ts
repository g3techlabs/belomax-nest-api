import { Module } from '@nestjs/common';
// import { TokenEmailConsumer } from './consumers/send-token-email.consumer';
import { SendWelcomeEmailConsumer } from './consumers/send-welcome-email.consumer';
import { QueueService } from './queue.service';
import { MailModule } from '../mail/mail.module';
import { SendTokenEmailConsumer } from './consumers/send-token-email.consumer';
import { HighlightPdfTermsConsumer } from './consumers/highlight-pdf-terms.consumer';
import { StatementExtractModule } from 'src/core/statement-extract/statement-extract.module';
import { ProvideFilledPetitionConsumer } from './consumers/provide-filled-petition.consumer';
import { DocumentModule } from 'src/core/document/document.module';
import { GeneratePensionerEarningsReportConsumer } from './consumers/generate-pensioner-earnings-report.consumer';
import { PensionerPaycheckModule } from 'src/core/pensioner-paycheck/pensioner-paycheck.module';

@Module({
  imports: [MailModule, StatementExtractModule, DocumentModule, PensionerPaycheckModule],
  controllers: [],
  providers: [
    SendWelcomeEmailConsumer,
    QueueService,
    SendTokenEmailConsumer,
    HighlightPdfTermsConsumer,
    ProvideFilledPetitionConsumer,
    GeneratePensionerEarningsReportConsumer
  ],
  exports: [SendWelcomeEmailConsumer],
})
export class QueueModule {}

import { MailModule } from './infrastructure/mail/mail.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { UserModule } from './core/user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { configConstants } from './auth/constants';
// import { join } from 'path';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ResetTokenModule } from './core/reset-token/reset-token.module';

@Module({
  imports: [
    MailModule,
    QueueModule,
    UserModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
      // prefix: 'belomax-',
    }),
    ResetTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

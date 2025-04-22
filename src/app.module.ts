/* eslint-disable */
import { AutomationModule } from './core/automation/automation.module';
import { PensionerPaycheckModule } from './core/pensioner-paycheck/pensioner-paycheck.module';
import { CustomerModule } from './core/customer/customer.module';
import { AwsModule } from './infrastructure/aws/aws.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { UserModule } from './core/user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResetTokenModule } from './core/reset-token/reset-token.module';
import { StatementExtractModule } from './core/statement-extract/statement-extract.module';
import { DocumentModule } from './core/document/document.module';
import { AuthModule } from './auth/auth.module';
import { PythonApiModule } from './infrastructure/api/python-api/python-api.module';

@Module({
  imports: [
    AutomationModule,
    PensionerPaycheckModule,
    CustomerModule,
    AwsModule,
    MailModule,
    QueueModule,
    UserModule,
    StatementExtractModule,
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ResetTokenModule,
    DocumentModule,
    AuthModule,
    PythonApiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

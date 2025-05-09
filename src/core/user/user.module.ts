import { UserController } from './controllers/user.controller';
import { forwardRef, Module } from '@nestjs/common';
import { FindUserService } from './services/find-user.service';
import { CreateUserService } from './services/create-user.service';
import { UserRepository } from './repositories/user.repository';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticateUserService } from './services/authenticate-user.service';
import { UpdateUserService } from './services/update-user.service';
import { ChangePasswordService } from './services/change-password.service';
import { FindManyUserService } from './services/find-many-user.service';
import { BullModule } from '@nestjs/bullmq';
import { ResetTokenRepository } from '../reset-token/repositories/reset-token.repository';
import { SendEmailTokenService } from './services/send-token.service';
import { VerifyTokenService } from './services/verify-token.service';
import { ResetPasswordService } from './services/reset-password.service';
import { SetPasswordService } from './services/set-password.service';
import { AuthModule } from 'src/auth/auth.module';
import { FindUserByEmailService } from './services/find-user-by-email.service';
import { UpdateActiveStatusService } from './services/update-active-status.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    BullModule.registerQueue({
      name: 'belomax-queue',
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [
    //Repositories
    UserRepository,
    ResetTokenRepository,
    //Services
    FindUserService,
    CreateUserService,
    AuthenticateUserService,
    UpdateUserService,
    ChangePasswordService,
    FindManyUserService,
    FindUserByEmailService,
    SendEmailTokenService,
    VerifyTokenService,
    ResetPasswordService,
    SetPasswordService,
    UpdateActiveStatusService
  ],
  exports: [UserRepository, FindUserService],
})
export class UserModule {}

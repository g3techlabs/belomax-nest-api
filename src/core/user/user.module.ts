import { UserController } from './controllers/user.controller';
import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    BullModule.registerQueue({
      name: 'users-queue',
    }),
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
    SendEmailTokenService,
    VerifyTokenService,
    ResetPasswordService,
    SetPasswordService,
  ],
  exports: [FindUserService],
})
export class UserModule {}

import { UserController } from './controllers/user.controller';
import { Module } from '@nestjs/common';
import { FindUserService } from './services/find-user.service';
import { CreateUserService } from './services/create-user.service';
import { UserRepository } from './repositories/user.repository';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { AuthenticateUserService } from './services/authenticate-user.service';
import { UpdateUserService } from './services/update-user.service';
import { ChangePasswordService } from './services/change-password.service';
import { FindManyUserService } from './services/find-many-user.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [UserController],
  providers: [
    //Repositories
    UserRepository,

    //Services
    FindUserService,
    CreateUserService,
    AuthenticateUserService,
    UpdateUserService,
    ChangePasswordService,
    FindManyUserService,
  ],
})
export class UserModule {}

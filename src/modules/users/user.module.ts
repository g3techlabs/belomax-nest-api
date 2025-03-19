import { UserController } from './controllers/user.controller';
import { Module } from '@nestjs/common';
import { FindUserService } from './services/find-user.service';
import { CreateUserService } from './services/create-user.service';
import { UserRepository } from './repositories/user.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    //Repositories
    UserRepository,

    //Services
    FindUserService,
    CreateUserService,
  ],
})
export class UserModule {}

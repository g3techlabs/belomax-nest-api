import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FindUserService } from '../services/find-user.service';
import { CreateUserService } from '../services/create-user.service';
import { CreateUserInput } from '../inputs/create-user.input';
import { AuthenticateUserInput } from '../inputs/authenticate-user.input';
import { AuthenticateUserDTO } from '../dtos/authenticate-user';
import { AuthenticateUserService } from '../services/authenticate-user.service';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { UpdateUserInput } from '../inputs/update-user.input';
import { UpdateUserService } from '../services/update-user.service';
import { ChangePasswordService } from '../services/change-password.service';
import { ChangePasswordInput } from '../inputs/change-password.input';
@Controller('users')
export class UserController {
  constructor(
    private readonly findUserService: FindUserService,
    private readonly createUserService: CreateUserService,
    private readonly authenticateUserService: AuthenticateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly changePasswordService: ChangePasswordService,
  ) {}

  @Post('authenticate')
  async authenticate(
    @Body() data: AuthenticateUserInput,
  ): Promise<AuthenticateUserDTO> {
    return await this.authenticateUserService.execute(data);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<User | null> {
    return await this.findUserService.execute(id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  async create(@Body() data: CreateUserInput): Promise<User | null> {
    return await this.createUserService.execute(data);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserInput,
  ): Promise<User> {
    return await this.updateUserService.execute(id, data);
  }

  @UseGuards(AuthGuard)
  @Put(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() data: ChangePasswordInput,
  ): Promise<User> {
    return await this.changePasswordService.execute(id, data);
  }
}

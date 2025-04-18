import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FindUserService } from '../services/find-user.service';
import { CreateUserService } from '../services/create-user.service';
import { CreateUserInput } from '../inputs/create-user.input';
import { AuthenticateUserInput } from '../inputs/authenticate-user.input';
import { AuthenticateUserDTO } from '../dtos/authenticate-user.dto';
import { AuthenticateUserService } from '../services/authenticate-user.service';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UpdateUserInput } from '../inputs/update-user.input';
import { UpdateUserService } from '../services/update-user.service';
import { ChangePasswordService } from '../services/change-password.service';
import { ChangePasswordInput } from '../inputs/change-password.input';
import { FindManyUserInput } from '../inputs/find-many-user.input';
import { FindManyUserService } from '../services/find-many-user.service';
import { SendEmailTokenService } from '../services/send-token.service';
import { VerifyTokenService } from '../services/verify-token.service';
import { VerifyTokenInput } from '../inputs/verify-token.input';
import { SendTokenEmailInput } from '../inputs/send-email-token.input';
import { ResetPasswordInput } from '../inputs/reset-password.input';
import { ResetPasswordService } from '../services/reset-password.service';
import { SetPasswordInput } from '../inputs/set-password.input';
import { SetPasswordService } from '../services/set-password.service';
import { UserWithoutPassword } from '../entities/user-without-password';

@Controller('api/users')
export class UserController {
  constructor(
    private readonly findUserService: FindUserService,
    private readonly createUserService: CreateUserService,
    private readonly authenticateUserService: AuthenticateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly changePasswordService: ChangePasswordService,
    private readonly findManyUserService: FindManyUserService,
    private readonly sendEmailTokenService: SendEmailTokenService,
    private readonly verifyTokenService: VerifyTokenService,
    private readonly resetPaswordService: ResetPasswordService,
    private readonly setPasswordService: SetPasswordService,
  ) {}

  @Post('authenticate')
  @HttpCode(HttpStatus.OK)
  async authenticate(
    @Body() data: AuthenticateUserInput,
  ): Promise<AuthenticateUserDTO> {
    return await this.authenticateUserService.execute(data);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<User | null> {
    return await this.findUserService.execute(id);
  }

  // @UseGuards(AuthGuard, AdminGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateUserInput): Promise<User | null> {
    return await this.createUserService.execute(data);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserInput,
  ): Promise<User> {
    return await this.updateUserService.execute(id, data);
  }

  @UseGuards(AuthGuard)
  @Put(':id/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id') id: string,
    @Body() data: ChangePasswordInput,
  ): Promise<User> {
    return await this.changePasswordService.execute(id, data);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findManyUser(
    @Query() data: FindManyUserInput,
  ): Promise<UserWithoutPassword[]> {
    return await this.findManyUserService.execute(data);
  }

  @Post('reset-password/send-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendTokenToEmail(@Body() data: SendTokenEmailInput): Promise<void> {
    return await this.sendEmailTokenService.send(data.email);
  }

  @Post('reset-password/verify-token')
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Body() data: VerifyTokenInput) {
    return await this.verifyTokenService.verify(data);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() data: ResetPasswordInput) {
    return await this.resetPaswordService.resetPassword(data);
  }

  @Post('set-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setPassword(@Body() data: SetPasswordInput) {
    return await this.setPasswordService.execute(data);
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateStatementExtractRequestInput } from '../inputs/create-statement-extract.input';
import { UpdateStatementExtractInput } from '../inputs/update-statement-extract.input';
import { CreateStatementExtractService } from '../services/create-statement-extract.service';
import { FindManyStatementExtractService } from '../services/find-many-statement-extract.service';
import { FindByIdStatementExtractService } from '../services/find-by-id-statement-extract.service';
import { UpdateStatementExtractService } from '../services/update-statement-extract.service';
import { StatementExtract, User } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CurrentUser } from 'src/auth/current-user';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/statement-extracts')
export class StatementExtractController {
  constructor(
    private readonly createStatementExtractService: CreateStatementExtractService,
    private readonly findManyStatementExtractService: FindManyStatementExtractService,
    private readonly findByIdStatementExtractService: FindByIdStatementExtractService,
    private readonly updateStatementExtractService: UpdateStatementExtractService,
  ) {}

  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async triggerAutomation(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateStatementExtractRequestInput,
  ): Promise<StatementExtract> {
    return await this.createStatementExtractService.execute({
      ...data,
      userId: user.id,
      file,
    });
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findMany(): Promise<StatementExtract[]> {
    return await this.findManyStatementExtractService.execute();
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<StatementExtract> {
    return await this.findByIdStatementExtractService.execute(id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateStatementExtractInput,
  ): Promise<StatementExtract> {
    return await this.updateStatementExtractService.execute(id, data);
  }
}

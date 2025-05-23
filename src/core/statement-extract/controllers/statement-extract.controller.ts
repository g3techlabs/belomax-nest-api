import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
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
import { CurrentUser } from 'src/auth/current-user';
import { FileInterceptor } from '@nestjs/platform-express';
import { FindManyStatementExtractInput } from '../inputs/find-many-statement-extract.input';

@Controller('statement-extracts')
export class StatementExtractController {
  constructor(
    private readonly createStatementExtractService: CreateStatementExtractService,
    private readonly findManyStatementExtractService: FindManyStatementExtractService,
    private readonly findByIdStatementExtractService: FindByIdStatementExtractService,
    private readonly updateStatementExtractService: UpdateStatementExtractService,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateStatementExtractRequestInput,
    @Headers('Authorization') token: string,
  ): Promise<StatementExtract> {
    return await this.createStatementExtractService.execute({
      ...data,
      userId: user.id,
      file,
      token,
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findMany(
    @Query() data: FindManyStatementExtractInput,
  ): Promise<StatementExtract[]> {
    return await this.findManyStatementExtractService.execute(data);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<StatementExtract> {
    return await this.findByIdStatementExtractService.execute(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateStatementExtractInput,
  ): Promise<StatementExtract> {
    return await this.updateStatementExtractService.execute(id, data);
  }
}

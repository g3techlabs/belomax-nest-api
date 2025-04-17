import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateStatementExtractInput } from '../inputs/create-statement-extract.input';
import { UpdateStatementExtractInput } from '../inputs/update-statement-extract.input';
import { CreateStatementExtractService } from '../services/create-statement-extract.service';
import { FindManyStatementExtractService } from '../services/find-many-statement-extract.service';
import { FindByIdStatementExtractService } from '../services/find-by-id-statement-extract.service';
import { UpdateStatementExtractService } from '../services/update-statement-extract.service';
import { StatementExtract } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('statement-extracts')
export class StatementExtractController {
  constructor(
    private readonly createStatementExtractService: CreateStatementExtractService,
    private readonly findManyStatementExtractService: FindManyStatementExtractService,
    private readonly findByIdStatementExtractService: FindByIdStatementExtractService,
    private readonly updateStatementExtractService: UpdateStatementExtractService,
  ) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  async create(
    @Body() data: CreateStatementExtractInput,
  ): Promise<StatementExtract> {
    return await this.createStatementExtractService.execute(data);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get()
  async findMany(): Promise<StatementExtract[]> {
    return await this.findManyStatementExtractService.execute();
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<StatementExtract> {
    return await this.findByIdStatementExtractService.execute(id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateStatementExtractInput,
  ): Promise<StatementExtract> {
    return await this.updateStatementExtractService.execute(id, data);
  }
}

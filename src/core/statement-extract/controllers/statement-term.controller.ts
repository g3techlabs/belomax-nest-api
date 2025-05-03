import {
  Body,
  Controller,
  Delete,
  Get,
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
import { CreateStatementTermsInput } from '../inputs/create-statement-terms.input';
import { CreateStatementTermsService } from '../services/create-statement-terms.service';
import { StatementTerm } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FindExtractTermsRequestInput } from '../inputs/find-extract-terms.input';
import { FileInterceptor } from '@nestjs/platform-express';
import { FindExtractTermsService } from '../services/extract-terms.service';
import { FindUniqueStatementTermService } from '../services/find-unique-statement-term.service';
import { FindUniqueStatementTermInput } from '../inputs/find-unique-statement-term.input';
import { FindManyStatementTermByBankInput } from '../inputs/find-many-statement-term-by-bank.input';
import { FindManyStatementTermByBankService } from '../services/find-many-statement-term-by-bank.service';
import { FindManyStatementTermService } from '../services/find-many-statement-term.service';
import { FindManyStatementTermInput } from '../inputs/find-many-statement-term.input';
import { UpdateStatementTermService } from '../services/update-statement-term.service';
import { UpdateStatementTermInput } from '../inputs/update-statement-term.input';
import { DeleteStatementTermService } from '../services/delete-statement-term.service';
import { ToggleStatementTermService } from '../services/toggle-statement-term.service';

@Controller('statement-terms')
export class StatementTermController {
  constructor(
    private readonly createStatementTermsService: CreateStatementTermsService,
    private readonly updateStatementTermService: UpdateStatementTermService,
    private readonly findExtractTermsService: FindExtractTermsService,
    private readonly findUniqueStatementTermService: FindUniqueStatementTermService,
    private readonly findManyStatementTermByBankService: FindManyStatementTermByBankService,
    private readonly findManyStatementTermService: FindManyStatementTermService,
    private readonly deleteStatementTermService: DeleteStatementTermService,
    private readonly toggleStatementTermService: ToggleStatementTermService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() data: CreateStatementTermsInput,
  ): Promise<StatementTerm[]> {
    return await this.createStatementTermsService.execute(data);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateStatementTermInput,
  ): Promise<StatementTerm> {
    return await this.updateStatementTermService.execute(id, data);
  }

  @UseGuards(AuthGuard)
  @Post('unique')
  @HttpCode(HttpStatus.OK)
  async findUnique(
    @Body() data: FindUniqueStatementTermInput,
  ): Promise<StatementTerm | null> {
    return await this.findUniqueStatementTermService.execute(data);
  }

  @UseGuards(AuthGuard)
  @Post('bank')
  async findManyByBank(
    @Body() data: FindManyStatementTermByBankInput,
  ): Promise<StatementTerm[]> {
    return await this.findManyStatementTermByBankService.execute(data);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findMany(
    @Query() data: FindManyStatementTermInput,
  ): Promise<StatementTerm[]> {
    return await this.findManyStatementTermService.execute(data);
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('extract')
  async extractTerms(
    @Body() data: FindExtractTermsRequestInput,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.findExtractTermsService.execute({ ...data, file });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTerm(@Param('id') id: string): Promise<void> {
    return await this.deleteStatementTermService.execute(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  async toggleStatus(@Param('id') id: string) {
    return await this.toggleStatementTermService.execute(id);
  }
}

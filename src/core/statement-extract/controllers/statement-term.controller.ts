import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
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

@Controller('api/statement-terms')
export class StatementTermController {
  constructor(
    private readonly createStatementTermsService: CreateStatementTermsService,
    private readonly findExtractTermsService: FindExtractTermsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() data: CreateStatementTermsInput,
  ): Promise<StatementTerm[]> {
    return await this.createStatementTermsService.execute(data);
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
}

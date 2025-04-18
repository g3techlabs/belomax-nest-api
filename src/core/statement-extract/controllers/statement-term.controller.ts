import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateStatementTermsInput } from '../inputs/create-statement-terms.input';
import { CreateStatementTermsService } from '../services/create-statement-terms.service';
import { StatementTerm } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('api/statement-terms')
export class StatementTermController {
  constructor(
    private readonly createStatementTermsService: CreateStatementTermsService,
  ) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() data: CreateStatementTermsInput,
  ): Promise<StatementTerm[]> {
    return await this.createStatementTermsService.execute(data);
  }
}

// @eslint-disable
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateDocumentInput } from '../inputs/create-document.input';
import { UpdateDocumentInput } from '../inputs/update-document.input';
import { CreateDocumentService } from '../services/create-document.service';
import { FindManyDocumentService } from '../services/find-many-document.service';
import { FindByIdDocumentService } from '../services/find-by-id-document.service';
import { UpdateDocumentService } from '../services/update-document.service';
import { Document } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { FindManyDocumentInput } from '../inputs/find-many-document.input';

@Controller('documents')
export class DocumentController {
  constructor(
    private readonly createDocumentService: CreateDocumentService,
    private readonly updateDocumentService: UpdateDocumentService,
    private readonly findManyDocumentService: FindManyDocumentService,
    private readonly findByIdDocumentService: FindByIdDocumentService,
  ) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  async create(@Body() data: CreateDocumentInput): Promise<Document> {
    return await this.createDocumentService.execute(data);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get()
  async findMany(@Body() data: FindManyDocumentInput): Promise<Document[]> {
    return await this.findManyDocumentService.execute();
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Document> {
    return await this.findByIdDocumentService.execute(id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateDocumentInput,
  ): Promise<Document> {
    return await this.updateDocumentService.execute(id, data);
  }
}

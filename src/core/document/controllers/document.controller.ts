// @eslint-disable
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
import { UpdateDocumentInput } from '../inputs/update-document.input';
import { FindManyDocumentService } from '../services/find-many-document.service';
import { FindByIdDocumentService } from '../services/find-by-id-document.service';
import { UpdateDocumentService } from '../services/update-document.service';
import { Document } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { FindManyDocumentInput } from '../inputs/find-many-document.input';
import { CreateDocumentRequestInput } from '../inputs/create-document.input';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDocumentService } from '../services/create-document.service';

@Controller('api/documents')
export class DocumentController {
  constructor(
    private readonly createDocumentService: CreateDocumentService,
    private readonly updateDocumentService: UpdateDocumentService,
    private readonly findManyDocumentService: FindManyDocumentService,
    private readonly findByIdDocumentService: FindByIdDocumentService,
  ) {}

  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() data: CreateDocumentRequestInput,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Document> {
    return await this.createDocumentService.execute({ ...data, file });
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findMany(@Body() data: FindManyDocumentInput): Promise<Document[]> {
    return await this.findManyDocumentService.execute(data);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<Document> {
    return await this.findByIdDocumentService.execute(id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateDocumentInput,
  ): Promise<Document> {
    return await this.updateDocumentService.execute(id, data);
  }
}

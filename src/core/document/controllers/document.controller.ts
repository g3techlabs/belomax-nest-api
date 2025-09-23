import { GetDocumentService } from './../services/get-document.service';
import { GetAllAutomationFilesService } from './../services/get-all-automation-files.service';
import { ProvideFilledPetitionService } from './../services/provide-filled-petition.service';
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
  Res,
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
import { FindManyDocumentInput } from '../inputs/find-many-document.input';
import { CreateDocumentRequestInput } from '../inputs/create-document.input';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDocumentService } from '../services/create-document.service';
import { GetDocumentUrlService } from '../services/get-document-url.service';
import { ProvideFilledPetitionInput } from '../inputs/provide-filled-petition.input';
import { GetAllAutomationFilesInput } from '../inputs/get-all-automation-files.input';
import { Response } from 'express';
import { Readable } from 'stream';

@Controller('documents')
export class DocumentController {
  constructor(
    private readonly createDocumentService: CreateDocumentService,
    private readonly updateDocumentService: UpdateDocumentService,
    private readonly findManyDocumentService: FindManyDocumentService,
    private readonly findByIdDocumentService: FindByIdDocumentService,
    private readonly getDocumentUrlService: GetDocumentUrlService,
    private readonly getDocumentService: GetDocumentService,
    private readonly provideFilledPetitionService: ProvideFilledPetitionService,
    private readonly getAllAutomationFilesService: GetAllAutomationFilesService,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() data: CreateDocumentRequestInput,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Document> {
    return await this.createDocumentService.execute({ ...data, file });
  }

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findMany(@Body() data: FindManyDocumentInput): Promise<Document[]> {
    return await this.findManyDocumentService.execute(data);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<Document> {
    return await this.findByIdDocumentService.execute(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateDocumentInput,
  ): Promise<Document> {
    return await this.updateDocumentService.execute(id, data);
  }

  @UseGuards(AuthGuard)
  @Get(':id/url')
  @HttpCode(HttpStatus.OK)
  async getDocumentUrl(@Param('id') id: string) {
    return await this.getDocumentUrlService.execute(id);
  }

  @UseGuards(AuthGuard)
  @Get(':id/download')
  @HttpCode(HttpStatus.OK)
  async downloadDocument(@Param('id') id: string, @Res() response: Response) {
    const s3Object = await this.getDocumentService.execute(id);

    response.setHeader(
      'Content-Disposition',
      `attachment; filename=${s3Object}`,
    );
    response.setHeader(
      'Content-Type',
      s3Object?.ContentType || 'application/octet-stream',
    );

    const stream = Readable.from(s3Object?.Body as any);
    stream.pipe(response);
  }

  @UseGuards(AuthGuard)
  @Post('/petition')
  async fillPetition(@Body() data: ProvideFilledPetitionInput) {
    return await this.provideFilledPetitionService.execute(data);
  }

  @UseGuards(AuthGuard)
  @Post('/download-everything')
  @HttpCode(HttpStatus.OK)
  async downloadAllAutomationFiles(
    @Body() data: GetAllAutomationFilesInput,
    @Res() response: Response,
  ) {
    const { file, name, finalized } =
      await this.getAllAutomationFilesService.execute(data);

    response.setHeader('Content-Type', 'application/zip');
    response.setHeader('Content-Disposition', `attachment; filename=${name}`);

    file.pipe(response);
    await finalized;
  }
}

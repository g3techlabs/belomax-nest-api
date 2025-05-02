// @eslint-disable @typescript-eslint/no-unused-vars
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import * as FormData from 'form-data';
import { ExtractValuePythonApiInput } from '../inputs/extract-value-python-api.input';

@Injectable()
export class ExtractValuePythonApiService {
  private readonly logger = new Logger(ExtractValuePythonApiService.name);
  private readonly url: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.url =
      this.configService.get<string>('PYTHON_API_URL') ??
      'http://localhost:8000';
  }

  async send({
    bank,
    file,
    term,
  }: ExtractValuePythonApiInput): Promise<number> {
    const endpoint = `${this.url}/extract-value`;

    const form = new FormData();
    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    form.append('bank', bank);
    form.append('term', term);

    try {
      const response = await firstValueFrom(
        this.httpService
          .post<number>(endpoint, form, {
            headers: form.getHeaders(),
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(
                `Erro ao chamar API externa: ${error.message}`,
                error.stack,
              );
              throw new Error('Erro ao processar extração de termos.');
            }),
          ),
      );

      return response.data;
    } catch (error) {
      this.logger.error('Falha ao obter termos da API Python.', error);
      throw error;
    }
  }
}

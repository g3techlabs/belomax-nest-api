// @eslint-disable @typescript-eslint/no-unused-vars
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ExtractTermsPythonApiInput } from '../inputs/extract-terms-python-api.input';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import FormData from 'form-data';

@Injectable()
export class ExtractTermsPythonApiService {
  private readonly logger = new Logger(ExtractTermsPythonApiService.name);
  private readonly url: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.url =
      this.configService.get<string>('PYTHON_API_URL') ??
      'http://localhost:8000';
  }

  async send({ bank, file }: ExtractTermsPythonApiInput): Promise<string[]> {
    const endpoint = `${this.url}/extract-terms`;

    const form = new FormData();
    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    form.append('bank', bank);

    try {
      const response = await firstValueFrom(
        this.httpService
          .post<string[]>(endpoint, form, {
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

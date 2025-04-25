import { Injectable } from '@nestjs/common';
import { ExtractTermsPythonApiService } from 'src/infrastructure/api/python-api/services/extract-terms-python-api.service';
import { FindExtractTermsServiceInput } from '../inputs/find-extract-terms.input';

@Injectable()
export class FindExtractTermsService {
  constructor(
    private readonly extractTermsPythonApiService: ExtractTermsPythonApiService,
  ) {}

  async execute({
    bank,
    file,
  }: FindExtractTermsServiceInput): Promise<string[]> {
    const responseData = await this.extractTermsPythonApiService.send({
      bank,
      file,
    });

    return responseData;
  }
}

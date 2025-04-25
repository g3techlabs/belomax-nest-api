import { IsNotEmpty, IsString } from 'class-validator';

export class FindExtractTermsRequestInput {
  @IsString()
  @IsNotEmpty()
  bank: string;
}

export class FindExtractTermsServiceInput {
  bank: string;
  file: Express.Multer.File;
}

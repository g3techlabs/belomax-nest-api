import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentRequestInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  automationId: string;
}

export class CreateDocumentServiceInput {
  name: string;
  automationId: string;
  file: Express.Multer.File;
}

export class CreateDocumentDataInput {
  name: string;
  automationId: string;
  url: string;
  file: Express.Multer.File;
}

export class CreateDocumentServiceInput {
  name: string;
  automationId: string;
  file: Express.Multer.File;
}

export class CreateDocumentDataInput {
  name: string;
  automationId: string;
  file: Express.Multer.File;
}

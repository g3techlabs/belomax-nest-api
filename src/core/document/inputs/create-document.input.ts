import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  automationId: string;
}

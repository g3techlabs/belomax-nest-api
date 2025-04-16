import { IsOptional, IsString } from 'class-validator';

export class UpdateDocumentInput {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  url?: string;
}

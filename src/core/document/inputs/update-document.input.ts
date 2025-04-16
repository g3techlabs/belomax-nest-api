import { IsOptional, IsString } from 'class-validator';

export class UpdateDocumentInput {
  @IsString()
  @IsOptional()
  name?: string;
}

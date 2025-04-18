import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateDocumentInput {
  @IsString()
  @IsOptional()
  name?: string;

  @IsDate()
  @IsOptional()
  urlExpiresAt?: Date;
}

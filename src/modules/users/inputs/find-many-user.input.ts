import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindManyUserInput {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsEnum(['ADMIN', 'USER'])
  @IsOptional()
  role?: 'ADMIN' | 'USER';

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  take?: number;
}

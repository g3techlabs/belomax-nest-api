import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

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
  role?: Role;

  @IsNumber()
  @IsOptional()
  page?: number;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  active?: boolean

  @IsNumber()
  @IsOptional()
  take?: number;
}

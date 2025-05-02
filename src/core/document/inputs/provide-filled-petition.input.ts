import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Customer, StatementBank } from '@prisma/client';
import { Bank } from '../dto/bank.dto';
import { Type } from 'class-transformer';

export class ProvideFilledPetitionInput {
  @IsNotEmpty()
  @ValidateNested()
  author: Omit<
    Customer,
    'id' | 'createdAt' | 'updatedAt' | 'birthDate' | 'email' | 'phone'
  >;

  @IsNotEmpty()
  @ValidateNested()
  @IsEnum(StatementBank)
  bank: StatementBank;

  @IsString()
  @IsNotEmpty()
  term: string;

  @IsNotEmpty()
  @IsNumber()
  chargedValue: number;

  @IsString()
  automationId: string;
}

export class ProvideFilledPetitionPopulateInfoInput {
  @IsNotEmpty()
  @ValidateNested()
  author: Omit<
    Customer,
    'id' | 'createdAt' | 'updatedAt' | 'birthDate' | 'email' | 'phone'
  >;

  @IsString()
  @IsNotEmpty()
  term: string;

  @IsNotEmpty()
  @IsNumber()
  chargedValue: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Bank)
  bank: Bank;
}

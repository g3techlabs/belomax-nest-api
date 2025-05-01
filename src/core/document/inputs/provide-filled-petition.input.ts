import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { Author } from "../dto/author.dto";
import { Bank } from "../dto/bank.dto";

export class ProvideFilledPetitionInput {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Author)
  author: Author;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Bank)
  bank: Bank;

  @IsString()
  @IsNotEmpty()
  term: string;

  @IsNotEmpty()
  @IsNumber()
  chargedValue: number;
}

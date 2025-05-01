import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Address } from "./address.dto";
import { Account } from "./account.dto";

export class Author {
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsNotEmpty()
    @IsString()
    citizenship: string;
  
    @IsNotEmpty()
    @IsString()
    maritalStatus: string;
  
    @IsNotEmpty()
    @IsString()
    occupation: string;
  
    @IsNotEmpty()
    @IsString()
    rg: string;
  
    @IsNotEmpty()
    @IsString()
    cpf: string;
  
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => Address)
    address: Address;
  
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => Account)
    account: Account;
  }
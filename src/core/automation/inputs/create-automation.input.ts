import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAutomationInput {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  customerId?: string;
}

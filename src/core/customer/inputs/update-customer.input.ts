/* eslint-disable */
import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCustomerInput } from './create-customer.input';
import { UpdateAddressInput } from './update-address.input';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCustomerInput extends PartialType(
  OmitType(CreateCustomerInput, ['address']),
) {
  @IsOptional()
  @Type(() => UpdateAddressInput)
  address?: UpdateAddressInput;
}

/* eslint-disable */
import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCustomerInput } from './create-customer.input';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateAddressInput } from 'src/core/address/inputs/update-address.input';

export class UpdateCustomerInput extends PartialType(
  OmitType(CreateCustomerInput, ['address']),
) {
  @IsOptional()
  @Type(() => UpdateAddressInput)
  address?: UpdateAddressInput;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class Address {
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsString()
  neighborhood: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;
}

export function formatAddress(address: Address) {
  return `${address.street}, ${address.number}, ${address.neighborhood} - ${address.city}, ${address.state}`;
}

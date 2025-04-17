import { Customer } from '@prisma/client';

export class FindManyCustomerDto {
  customers: Customer[];
  totalCount: number;
}

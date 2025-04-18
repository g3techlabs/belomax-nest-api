/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { CreateCustomerService } from './services/create-customer.service';
import { FindManyCustomerService } from './services/find-many-customer.service';
import { FindByIdCustomerService } from './services/find-by-id-customer.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CustomerController } from './controllers/customer.controller';
import { CustomerRepository } from './repositories/customer.repository';
import { FindByCpfCustomerService } from './services/find-by-cpf-customer.service';
import { UpdateCustomerService } from './services/update-customer.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [CustomerController],
  providers: [
    //Repositories
    CustomerRepository,

    //Services
    CreateCustomerService,
    UpdateCustomerService,
    FindManyCustomerService,
    FindByIdCustomerService,
    FindByCpfCustomerService,
  ],
  exports: [
    FindByIdCustomerService,
    FindByCpfCustomerService,
    CreateCustomerService,
  ],
})
export class CustomerModule {}

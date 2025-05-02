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
import { FindByCpfCnpjCustomerService } from './services/find-by-cpf-cnpj-customer.service';
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
    FindByCpfCnpjCustomerService,
  ],
  exports: [
    FindByIdCustomerService,
    FindByCpfCnpjCustomerService,
    CreateCustomerService,
  ],
})
export class CustomerModule {}

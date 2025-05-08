/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { AddressRepository } from './repositories/address.repository';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [AddressRepository],
  exports: [AddressRepository],
})
export class AddressModule {}

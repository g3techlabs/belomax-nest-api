/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { PensionerPaycheckRepository } from './repositories/pensioner-paycheck.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [PensionerPaycheckRepository],
})
export class PensionerPaycheckModule {}

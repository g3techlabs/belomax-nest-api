// infrastructure/external-apis/python-api/python-api.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
// import { ConfigModule } from '@nestjs/config';
import { ExtractTermsPythonApiService } from './services/extract-terms-python-api.service';

@Module({
  imports: [HttpModule],
  providers: [ExtractTermsPythonApiService],
  exports: [ExtractTermsPythonApiService],
})
export class PythonApiModule {}

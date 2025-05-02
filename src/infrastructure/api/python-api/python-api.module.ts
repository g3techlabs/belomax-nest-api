// infrastructure/external-apis/python-api/python-api.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
// import { ConfigModule } from '@nestjs/config';
import { ExtractTermsPythonApiService } from './services/extract-terms-python-api.service';
import { ExtractValuePythonApiService } from './services/extract-value-python-api.service';

@Module({
  imports: [HttpModule],
  providers: [ExtractTermsPythonApiService, ExtractValuePythonApiService],
  exports: [ExtractTermsPythonApiService, ExtractValuePythonApiService],
})
export class PythonApiModule {}

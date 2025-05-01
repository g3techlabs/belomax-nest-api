import { ProvideFilledPetitionService } from './../../../core/document/services/provide-filled-petition.service';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { ProvideFilledPetitionInput } from 'src/core/document/inputs/provide-filled-petition.input';

@Injectable()
export class ProvideFilledPetitionConsumer {
  constructor(private readonly provideFilledPetitionService: ProvideFilledPetitionService) {}

  async execute(job: Job<ProvideFilledPetitionInput>) {
    await this.provideFilledPetitionService.execute(job.data);

    return {}
  }
}

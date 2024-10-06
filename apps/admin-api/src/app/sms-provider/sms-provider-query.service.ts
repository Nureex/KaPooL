import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@ptc-org/nestjs-query-core';
import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';
import { SMSProviderEntity } from '@ridy/database/sms-provider.entity';
import { Repository } from 'typeorm';
import { SMSProviderDTO } from './dto/sms-provider.dto';
import { SMSProviderInput } from './dto/sms-provider.input';

@QueryService(SMSProviderDTO)
export class SMSProviderQueryService extends TypeOrmQueryService<SMSProviderDTO> {
  constructor(
    @InjectRepository(SMSProviderEntity)
    public repo: Repository<SMSProviderEntity>,
  ) {
    super(repo);
  }

  override async createOne(record: SMSProviderInput): Promise<SMSProviderDTO> {
    const count = await this.repo.count();
    if (count === 0) {
      record.isDefault = true;
    }
    if (record.isDefault) {
      await this.repo.update({}, { isDefault: false });
    }
    return super.createOne(record);
  }
}

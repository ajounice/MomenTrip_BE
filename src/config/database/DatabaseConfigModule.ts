import { Module } from '@nestjs/common';
import { DatabaseConfigService } from '@/config/database/DatabaseConfigService';

@Module({
    providers: [DatabaseConfigService],
})
export class DatabaseConfigModule {}

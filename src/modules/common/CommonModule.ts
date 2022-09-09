import { Module } from '@nestjs/common';
import { CommonService } from '@/modules/common/CommonService';
import { FileStorage } from '@/common/utils';

@Module({
    exports: [CommonService],
    providers: [CommonService, FileStorage],
})
export class CommonModule {}

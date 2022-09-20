import { Module } from '@nestjs/common';
import { CommonService } from '@/modules/common/CommonService';
import { FileStorage, VideoConverter } from '@/common/utils';

@Module({
    exports: [CommonService],
    providers: [CommonService, FileStorage, VideoConverter],
})
export class CommonModule {}

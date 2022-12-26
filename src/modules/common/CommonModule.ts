import { Module } from '@nestjs/common';
import { CommonService } from '@/modules/common/CommonService';
import { FileStorage, VideoConsumer, VideoProducer } from '@/common/utils';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'video',
        }),
    ],
    exports: [CommonService],
    providers: [CommonService, FileStorage, VideoProducer, VideoConsumer],
})
export class CommonModule {}

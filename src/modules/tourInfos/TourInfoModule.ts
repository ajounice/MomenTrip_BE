import { Module } from '@nestjs/common';
import { TourInfoController } from './TourInfoController';
import { TourInfoService } from './TourInfoService';

@Module({
    controllers: [TourInfoController],
    providers: [TourInfoService],
})
export class TourInfoModule {}

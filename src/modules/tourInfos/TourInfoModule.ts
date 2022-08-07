import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TourInfoController } from './TourInfoController';
import { TourInfoService, TourInfoLikeService, TourInfoCommentService } from './services';
import { TourInfo, TourInfoComment, TourInfoLike } from '@/modules/tourInfos/entities';

@Module({
    imports: [TypeOrmModule.forFeature([TourInfo, TourInfoLike, TourInfoComment])],
    controllers: [TourInfoController],
    providers: [TourInfoService, TourInfoLikeService, TourInfoCommentService],
})
export class TourInfoModule {}

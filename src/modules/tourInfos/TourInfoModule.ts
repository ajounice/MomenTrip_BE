import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TourInfoController } from './TourInfoController';
import { TourInfoService, TourInfoLikeService, TourInfoCommentService } from './services';
import { TourInfo, TourInfoComment, TourInfoLike } from '@/modules/tourInfos/entities';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([TourInfo, TourInfoLike, TourInfoComment]),
        HttpModule.register({
            timeout: 5000,
        }),
        ConfigModule,
    ],
    controllers: [TourInfoController],
    providers: [TourInfoService, TourInfoLikeService, TourInfoCommentService],
    exports: [TourInfoService],
})
export class TourInfoModule {}

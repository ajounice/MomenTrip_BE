import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Follow } from '@/modules/follows/entities/Follow';
import { FollowController } from '@/modules/follows/FollowController';
import { FollowListService, FollowService } from '@/modules/follows/services';

@Module({
    imports: [TypeOrmModule.forFeature([Follow])],
    controllers: [FollowController],
    providers: [FollowService, FollowListService],
    exports: [FollowListService, FollowService, TypeOrmModule],
})

export class FormModule {}

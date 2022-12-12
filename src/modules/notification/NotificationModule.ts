import { Module } from '@nestjs/common';
import { NotificationService } from '@/modules/notification/NotificationService';
import { NotificationController } from '@/modules/notification/NotificationController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notify } from '@/modules/notification/entities';

@Module({
    exports: [NotificationService, TypeOrmModule.forFeature([Notify])],
    controllers: [NotificationController],
    providers: [NotificationService],
})
export class NotificationModule {}

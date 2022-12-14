import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from '@/modules/notification/NotificationService';
import { NotificationController } from '@/modules/notification/NotificationController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notify } from '@/modules/notification/entities';
import { UserModule } from '@/modules/users/UserModule';

@Module({
    imports: [TypeOrmModule.forFeature([Notify]), UserModule],
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [NotificationService, TypeOrmModule],
})
export class NotificationModule {}

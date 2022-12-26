import { Module } from '@nestjs/common';
import { UserController } from './UserController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFollowService, UserProfileService, UserService } from '@/modules/users/services';
import { AuthModule } from '@/modules/auth/AuthModule';
import { CommonModule } from '@/modules/common/CommonModule';
import { Follow, User } from '@/modules/users/entities';
import { NotificationModule } from '@/modules/notification/NotificationModule';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Follow]),
        AuthModule,
        CommonModule,
        NotificationModule,
    ],
    exports: [UserService],
    controllers: [UserController],
    providers: [UserService, UserProfileService, UserFollowService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { UserController } from './UserController';
import { UserService } from '@/modules/users/services/UserService';
import { User } from '@/modules/users/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBlockService, UserProfileService } from '@/modules/users/services';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    exports: [UserService],
    controllers: [UserController],
    providers: [UserService, UserProfileService, UserBlockService],
})
export class UserModule {}

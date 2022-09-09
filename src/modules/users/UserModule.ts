import { Module } from '@nestjs/common';
import { UserController } from './UserController';
import { UserService } from '@/modules/users/services/UserService';
import { User } from '@/modules/users/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileService } from '@/modules/users/services';
import { AuthModule } from '@/modules/auth/AuthModule';
import { CommonModule } from '@/modules/common/CommonModule';

@Module({
    imports: [TypeOrmModule.forFeature([User]), AuthModule, CommonModule],
    exports: [UserService],
    controllers: [UserController],
    providers: [UserService, UserProfileService],
})
export class UserModule {}

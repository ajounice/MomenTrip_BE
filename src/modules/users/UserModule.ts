import { Module } from '@nestjs/common';
import { UserController } from './UserController';
import { UserService } from '@/modules/users/UserService';
import { User } from '@/modules/users/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    exports: [UserService],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { UserController } from './UserController';
import { UserService } from './UserService';

@Module({
    exports: [],
    imports: [],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}

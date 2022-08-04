import { Module } from '@nestjs/common';
import { AuthService } from './AuthService';
import { UserModule } from '../UserModule';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from './strategies';
import { AuthController } from '@/modules/users/auth/AuthController';

@Module({
    imports: [UserModule, PassportModule],
    providers: [AuthService, KakaoStrategy],
    controllers: [AuthController],
})
export class AuthModule {}

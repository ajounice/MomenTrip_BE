import { Module } from '@nestjs/common';
import { AuthService } from './AuthService';
import { UserModule } from '../users/UserModule';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from './strategies';

@Module({
    imports: [UserModule, PassportModule],
    providers: [AuthService, KakaoStrategy],
})
export class AuthModule {}

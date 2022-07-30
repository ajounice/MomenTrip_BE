import { Module } from '@nestjs/common';
import { AuthService } from './AuthService';
import { UserModule } from '../users/UserModule';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy, KakaoStrategy } from './strategies';

@Module({
    imports: [UserModule, PassportModule],
    providers: [AuthService, LocalStrategy, KakaoStrategy],
})
export class AuthModule {}

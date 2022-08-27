import { Module } from '@nestjs/common';
import { AuthService } from './AuthService';
import { JwtStrategy, KakaoStrategy } from './strategies';
import { AuthController } from '@/modules/auth/AuthController';
import { User } from '@/modules/users/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: '3600s',
            },
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [AuthService, KakaoStrategy, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './AuthService';
import { JwtStrategy, KakaoStrategy, LocalStrategy } from './strategies';
import { AuthController } from '@/modules/auth/AuthController';
import { User } from '@/modules/users/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: '3600s',
                },
            }),
            inject: [ConfigService],
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [AuthService, KakaoStrategy, JwtStrategy, LocalStrategy],
    controllers: [AuthController],
})
export class AuthModule {}

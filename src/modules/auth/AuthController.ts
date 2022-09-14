import { Body, Controller, Get, Post, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './AuthService';
import { UserKakaoDto, UserLocalDto } from '@/modules/auth/dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('/kakao')
    @UseGuards(AuthGuard('kakao'))
    async kakaoLogin() {
        return;
    }

    @Get('/kakao/callback')
    @UseGuards(AuthGuard('kakao'))
    async kakaoLoginCallback(@Req() req): Promise<{ accessToken: string }> {
        return this.authService.kakaoLogin(req.user as UserKakaoDto);
    }

    @Post('/login')
    @UseGuards(AuthGuard('local'))
    async localLogin(@Req() req): Promise<{ accessToken: string }> {
        return this.authService.localLogin(req.user as UserLocalDto);
    }
}

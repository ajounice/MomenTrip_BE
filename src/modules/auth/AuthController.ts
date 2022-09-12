import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './AuthService';
import { UserKakaoDto } from '@/modules/auth/dto';

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
}

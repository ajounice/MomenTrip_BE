import { Controller, Get, HttpCode, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './AuthService';
import { UserKakaoDto } from '@/modules/users/auth/dtos';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('/kakao')
    @UseGuards(AuthGuard('kakao'))
    async kakaoLogin(@Req() req) {
        return req.user as UserKakaoDto;
    }

    @Get('/kakao/callback')
    @HttpCode(200)
    @UseGuards(AuthGuard('kakao'))
    async kakaoLoginCallback(@Req() req): Promise<{ accessToken: string }> {
        return this.authService.kakaoLogin(req.user as UserKakaoDto);
    }
}

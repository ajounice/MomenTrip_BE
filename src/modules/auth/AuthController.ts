import { Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './AuthService';
import { UserKakaoDto } from '@/modules/auth/dtos';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /*
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Req() req) {
        return req.user;
    }*/

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

import { Body, Controller, Get, Post, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './AuthService';
import { CreateUserDto, UserKakaoDto, UserLocalDto } from '@/modules/auth/dto';

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
        console.log('local login controller', req.user);
        return this.authService.localLogin(req.user as UserLocalDto);
    }

    //로컬 로그인(유저생성)
    @Post('/signup')
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.authService.createUser(createUserDto);
    }
}

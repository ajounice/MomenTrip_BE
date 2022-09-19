import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './AuthService';
import { CreateUserDto, UserKakaoDto } from '@/modules/auth/dto';
import { User } from '@/modules/users/entities';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('/email/duplicate')
    async checkEmail(@Body('email') email: string) {
        const isDuplicated = await this.authService.checkEmail(email);

        return isDuplicated;
    }

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

    //로컬 로그인
    @Post('/login')
    @UseGuards(AuthGuard('local'))
    async localLogin(@Req() req): Promise<{ accessToken: string }> {
        return this.authService.localLogin(req.user);
    }

    //로컬 회원가입(유저생성)
    @Post('/signup')
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.authService.createUser(createUserDto);
    }
}

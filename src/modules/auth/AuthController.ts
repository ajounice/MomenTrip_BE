import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './AuthService';
import { CreateUserDto, UserKakaoDto } from '@/modules/auth/dto';
import { AccessTokenResponse, CheckEmailResponse } from '@/modules/auth/dto/response';
import { UserResponse } from '@/modules/users/dto/response';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/email/duplicate')
    async checkEmail(@Body('email') email: string) {
        const isDuplicated = await this.authService.checkEmail(email);

        return new CheckEmailResponse(isDuplicated);
    }

    @Get('/kakao')
    @UseGuards(AuthGuard('kakao'))
    async kakaoLogin() {
        return;
    }

    @Get('/kakao/callback')
    @UseGuards(AuthGuard('kakao'))
    async kakaoLoginCallback(@Req() req): Promise<{ accessToken: string }> {
        const { accessToken } = await this.authService.kakaoLogin(req.user as UserKakaoDto);

        return new AccessTokenResponse(accessToken);
    }

    //로컬 로그인
    @Post('/login')
    @UseGuards(AuthGuard('local'))
    async localLogin(@Req() req): Promise<{ accessToken: string }> {
        const { accessToken } = await this.authService.localLogin(req.user);

        return new AccessTokenResponse(accessToken);
    }

    //로컬 회원가입(유저생성)
    @Post('/signup')
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
        const user = await this.authService.createUser(createUserDto);

        return new UserResponse(user);
    }
}

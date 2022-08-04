import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserKakaoDto {
    @IsString()
    @IsNotEmpty()
    nickname: string;

    @IsOptional()
    @IsEmail()
    email: string | null;

    @IsString()
    @IsNotEmpty()
    kakaoId: string;

    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @IsString()
    image: string | null;
}

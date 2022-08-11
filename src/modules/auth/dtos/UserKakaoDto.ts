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
    name: string;

    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @IsOptional()
    @IsString()
    image: string | null;
}

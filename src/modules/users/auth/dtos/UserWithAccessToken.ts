import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserWithAccessTokenDto {
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    kakaoId: string;

    @IsString()
    @IsNotEmpty()
    nickname: string;

    @IsOptional()
    @IsEmail()
    email: string | null;
}

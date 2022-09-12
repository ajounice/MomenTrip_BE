import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserKakaoDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsOptional()
    @IsEmail()
    email: string | null;

    @IsString()
    @IsOptional()
    name: string | null;

    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @IsOptional()
    @IsString()
    image: string | null;
}
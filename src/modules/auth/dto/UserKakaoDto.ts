import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserKakaoDto {
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsNotEmpty()
    accessToken!: string;

    @IsOptional()
    @IsString()
    image?: string;
}

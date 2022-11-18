import { IsOptional, IsString } from 'class-validator';

export class UpdateUserInfoDto {
    @IsOptional()
    @IsString()
    nickname: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    intro: string;
}

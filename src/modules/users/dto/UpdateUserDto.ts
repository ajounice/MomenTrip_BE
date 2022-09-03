import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    image: string | null;

    @IsNotEmpty()
    @IsString()
    nickname: string;

    @IsOptional()
    @IsString()
    name: string | null;

    @IsOptional()
    @IsString()
    intro: string | null;
}

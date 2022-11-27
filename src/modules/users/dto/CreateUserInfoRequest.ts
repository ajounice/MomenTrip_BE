import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserInfoRequest {
    @IsNotEmpty()
    @IsString()
    nickname!: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    intro?: string;
}

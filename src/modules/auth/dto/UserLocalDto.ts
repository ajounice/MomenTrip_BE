import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserLocalDto {
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    password!: string;
}

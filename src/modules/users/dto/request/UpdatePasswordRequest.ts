import { IsString } from 'class-validator';

export class UpdatePasswordRequest {
    @IsString()
    public password: string;

    @IsString()
    public passwordConfirmation: string;
}

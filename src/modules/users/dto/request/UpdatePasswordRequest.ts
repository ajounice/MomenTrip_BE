import { IsString } from 'class-validator';

export class UpdatePasswordRequest {
    @IsString()
    public currentPassword: string;

    @IsString()
    public changePassword: string;

    @IsString()
    public changePasswordConfirmation: string;
}

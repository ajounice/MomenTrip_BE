import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFormCommentRequest {
    @IsNotEmpty()
    @IsString()
    content!: string;
}

import { FormComment } from '@/modules/forms/entities';
import { IsNotEmpty, IsString } from 'class-validator';

export class SaveFormCommentRequest {
    @IsNotEmpty()
    @IsString()
    content!: string;

    toEntity(userId: number, formId: number): FormComment {
        const comment = FormComment.from(userId, formId);
        comment.content = this.content;

        return comment;
    }
}

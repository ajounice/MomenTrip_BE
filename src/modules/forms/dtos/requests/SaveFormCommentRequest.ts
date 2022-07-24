import { FormComment } from '@/modules/forms/entities';

export class SaveFormCommentRequest {
    content!: string;

    toEntity(userId: number, formId: number): FormComment {
        const comment = FormComment.from(userId, formId);
        comment.content = this.content;

        return comment;
    }
}

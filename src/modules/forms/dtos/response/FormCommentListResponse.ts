import { FormCommentResponse } from '@/modules/forms/dtos/response/FormCommentResponse';
import { FormComment } from '@/modules/forms/entities';

export class FormCommentListResponse {
    list: FormCommentResponse[];

    constructor(record: FormComment[]) {
        this.list = record.map((comment) => new FormCommentResponse(comment));
    }
}

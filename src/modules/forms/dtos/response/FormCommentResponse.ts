import { FormComment } from '@/modules/forms/entities';

export class FormCommentResponse {
    public id: number;

    public content: string;

    public user?: { id: number; nickname: string; image: string };

    public form?: { id: number };

    constructor(record: FormComment) {
        this.id = record.id;
        this.content = record.content;
        this.user = record.user || undefined;
        this.form = record.form || undefined;
    }
}

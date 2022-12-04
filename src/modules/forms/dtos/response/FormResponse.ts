import { Form } from '@/modules/forms/entities';

export class FormResponse {
    public id: number;

    public content: string;

    public title: string;

    public thumbnail: string;

    public video: string;

    public viewCount: number;

    constructor(record: Form) {
        this.id = record.id;
        this.content = record.content;
        this.title = record.title;
        this.thumbnail = record.thumbnail;
        this.video = record.video;
        this.viewCount = record.viewCount;
    }
}

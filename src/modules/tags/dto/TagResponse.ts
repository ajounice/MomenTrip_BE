import { Tag } from '@/modules/tags/entities/Tag';

export class TagResponse {
    public id: number;

    public name: string;

    public viewCount: number;

    constructor(record: Tag) {
        this.id = record.id;
        this.name = record.name;
        this.viewCount = record.viewCount;
    }
}

import { Tag } from '@/modules/tags/entities/Tag';
import { TagResponse } from '@/modules/tags/dto/TagResponse';

export class TagListResponse {
    list: TagResponse[];

    constructor(record: Tag[]) {
        this.list = record.map((tag) => new TagResponse(tag));
    }
}

import { Point } from 'wkx';
import { TourInfo, TourInfoComment, TourInfoLike } from '@/modules/tourInfos/entities';
import { Tag } from '@/modules/tags/entities/Tag';

export class TourInfoResponse {
    public id: number;

    public name: string;

    public place: Point;

    public image: string;

    public viewCount: number;

    public comments?: TourInfoComment[];

    public likes?: TourInfoLike[];

    public tags?: Tag[];

    constructor(record: TourInfo) {
        this.id = record.id;
        this.name = record.name;
        this.place = record.place;
        this.image = record.image;
        this.viewCount = record.viewCount;
        this.comments = record?.comments || [];
        this.likes = record?.likes || [];
        this.tags = record?.tags || [];
    }
}

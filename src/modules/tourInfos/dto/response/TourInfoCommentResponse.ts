import { TourInfoComment } from '@/modules/tourInfos/entities';

export class TourInfoCommentResponse {
    public id: number;

    public content: string;

    public user?: { id: number; nickname: string; image: string };

    public tourInfo?: { id: number };

    constructor(record: TourInfoComment) {
        this.id = record.id;
        this.content = record.content;
        this.user = record.user || undefined;
        this.tourInfo = record.tourInfo || undefined;
    }
}

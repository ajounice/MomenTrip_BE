import { TourInfoCommentResponse } from '@/modules/tourInfos/dto/response/TourInfoCommentResponse';
import { TourInfoComment } from '@/modules/tourInfos/entities';

export class TourInfoCommentListResponse {
    list: TourInfoCommentResponse[];

    constructor(record: TourInfoComment[]) {
        this.list = record.map((comment) => new TourInfoCommentResponse(comment));
    }
}

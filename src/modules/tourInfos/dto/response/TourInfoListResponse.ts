import { TourInfoResponse } from '@/modules/tourInfos/dto/response/TourInfoResponse';
import { TourInfo } from '@/modules/tourInfos/entities';

export class TourInfoListResponse {
    list: TourInfoResponse[];

    constructor(record: TourInfo[]) {
        this.list = record.map((info) => new TourInfoResponse(info));
    }
}

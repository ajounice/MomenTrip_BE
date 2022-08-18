import { TourInfoComment } from '@/modules/tourInfos/entities';

export class SaveTourInfoCommentRequest {
    content!: string;

    toEntity(userId: number, infoId: number): TourInfoComment {
        const comment = TourInfoComment.from(userId, infoId);
        comment.content = this.content;

        return comment;
    }
}

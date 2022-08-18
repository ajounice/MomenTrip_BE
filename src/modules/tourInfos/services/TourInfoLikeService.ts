import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TourInfoLike } from '@/modules/tourInfos/entities';

@Injectable()
export class TourInfoLikeService {
    constructor(
        @InjectRepository(TourInfoLike)
        private readonly tourInfoLikeRepository: Repository<TourInfoLike>,
    ) {}

    private findLike(userId: number, infoId: number) {
        return this.tourInfoLikeRepository.findOne({
            where: { user: { id: userId }, tourInfo: { id: infoId } },
        });
    }

    async like(user: { id: number }, id: number) {
        const exists = await this.findLike(user.id, id);

        if (exists) {
            await this.tourInfoLikeRepository.remove(exists);
            return false;
        }
        const like = TourInfoLike.from(user.id, id);

        await this.tourInfoLikeRepository.save(like);

        return true;
    }
}

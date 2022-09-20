import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/users/entities';
import { TourInfo } from '@/modules/tourInfos/entities/index';

@Entity({ name: 'tour_info_likes' })
export class TourInfoLike {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @ManyToOne(() => TourInfo)
    tourInfo!: TourInfo;

    static from(userId: number, infoId: number) {
        const like = new TourInfoLike();

        like.tourInfo = new TourInfo();
        like.user = new User();

        like.tourInfo.id = infoId;
        like.user.id = userId;

        return like;
    }
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/users/entities';
import { TourInfo } from '@/modules/tourInfos/entities/TourInfo';

@Entity({ name: 'tour_info_comments' })
export class TourInfoComment {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @Column()
    content!: string;

    @ManyToOne(() => User)
    user!: User;

    @ManyToOne(() => TourInfo)
    tourInfo!: TourInfo;

    static from(userId: number, infoId: number) {
        const comment = new TourInfoComment();
        comment.user = new User();
        comment.tourInfo = new TourInfo();

        comment.user.id = userId;
        comment.tourInfo.id = infoId;

        return comment;
    }
}

import { Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from '@/modules/users/entities/User';

@Entity({ name: 'follows' })
export class Follow {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @ManyToOne(() => User, (user) => user.followers)
    follower!: User; //팔로우 주체

    @ManyToOne(() => User, (user) => user.followings)
    following!: User; //팔로우 대상

    @RelationId((follow: Follow) => follow.follower)
    followerId!: number;

    @RelationId((follow: Follow) => follow.following)
    followingId!: number;
}

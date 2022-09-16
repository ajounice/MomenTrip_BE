import { Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from '@/modules/users/entities/User';

@Entity({ name: 'follows' })
export class Follow {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @ManyToOne(() => User, (user) => user.followers)
    follower!: User;//나를 팔로우 하는 유저

    @ManyToOne(() => User, (user) => user.followings)
    following!: User;//내가 팔로우 하는 유저

    @RelationId((following: Follow) => following.follower)
    followerId!: number;

    @RelationId((following: Follow) => following.following)
    followingId!: number;
}

import { Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from '@/modules/users/entities/User';

@Entity({ name: 'follows' })
export class Follow {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @ManyToOne(() => User, (user) => user.followers)
    follower!: User;

    @ManyToOne(() => User, (user) => user.followings)
    following!: User;

    @RelationId((following: Follow) => following.follower)
    followerId!: number;

    @RelationId((following: Follow) => following.following)
    followingId!: number;
}

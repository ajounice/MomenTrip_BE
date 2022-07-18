import { Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from '@/modules/users/entities/User';

@Entity({ name: 'followings' })
export class Following {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @ManyToOne(() => User, (user) => user.followers)
    follower!: User;

    @ManyToOne(() => User, (user) => user.followings)
    following!: User;

    @RelationId((following: Following) => following.follower)
    followerId!: number;

    @RelationId((following: Following) => following.following)
    followingId!: number;
}

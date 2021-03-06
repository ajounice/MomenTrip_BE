import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Badge } from '@/modules/users/entities/Badge';
import { Following } from '@/modules/users/entities/Following';
import { UserStatistics } from '@/modules/users/entities/UserStatistics';
import { Wishlist } from '@/modules/wishlists/entities/Wishlist';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @Column({ unique: true, nullable: false })
    nickname!: string;

    @Column({ unique: true, nullable: false })
    email!: string;

    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: false, default: false })
    type!: boolean;

    @Column()
    image!: string;

    @OneToOne(() => UserStatistics, (statistics) => statistics.user, { onDelete: 'CASCADE' })
    statistics!: UserStatistics;

    @OneToMany(() => Badge, (badge) => badge.user)
    badges!: Badge[];

    @OneToMany(() => Following, (following) => following.follower)
    followers!: Following[];

    @OneToMany(() => Following, (following) => following.following)
    followings!: Following[];

    @OneToMany(() => Wishlist, (wishlist) => wishlist.user, { onDelete: 'CASCADE' })
    wishlists!: Wishlist[];
}

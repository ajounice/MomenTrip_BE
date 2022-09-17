import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Badge } from '@/modules/users/entities/Badge';
import { Follow } from '@/modules/follows/entities/Follow';
import { UserStatistics } from '@/modules/users/entities/UserStatistics';
import { WishlistFolder } from '@/modules/wishlists/entities';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number; //kakao id

    @Column({ unique: true, nullable: true })
    email!: string;

    @Column({ unique: true, nullable: true })
    nickname!: string;

    @Column({ nullable: true })
    password!: string;

    @Column({ nullable: true })
    name!: string;

    @Column({ nullable: true, default: null })
    intro!: string;

    @Column({ nullable: false, default: false })
    type!: boolean;

    @Column({ nullable: true })
    image!: string;

    @OneToOne(() => UserStatistics, (statistics) => statistics.user, { onDelete: 'CASCADE' })
    statistics!: UserStatistics;

    @OneToMany(() => Badge, (badge) => badge.user)
    badges!: Badge[];

    @OneToMany(() => Follow, (follow) => follow.follower)
    followers!: Follow[];

    @OneToMany(() => Follow, (follow) => follow.following)
    followings!: Follow[];

    @OneToMany(() => WishlistFolder, (wishlistFolder) => wishlistFolder.user)
    wishlistFolders!: WishlistFolder[];
}

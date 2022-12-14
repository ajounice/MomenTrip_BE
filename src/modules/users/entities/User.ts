import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Badge } from '@/modules/users/entities/Badge';
import { Follow } from '@/modules/users/entities/Follow';
import { UserStatistics } from '@/modules/users/entities/UserStatistics';
import { WishlistFolder } from '@/modules/wishlists/entities';
import { Form } from '@/modules/forms/entities';
import { Notify } from '@/modules/notification/entities';

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
    followers!: Follow[]; //유저를 팔로우

    @OneToMany(() => Follow, (follow) => follow.following)
    followings!: Follow[]; //유저가 팔로우 (대상)

    @OneToMany(() => WishlistFolder, (wishlistFolder) => wishlistFolder.user)
    wishlistFolders!: WishlistFolder[];

    @OneToMany(() => Form, (form) => form.user, { onDelete: 'SET NULL' })
    forms!: Form[];

    badgeList?: any[];
}

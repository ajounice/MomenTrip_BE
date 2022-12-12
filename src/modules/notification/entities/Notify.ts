import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WishType } from '@/modules/wishlists/entities';
import { User } from '@/modules/users/entities';

export enum NotifyType {
    COMMENT = 'COMMENT ',
    LIKE = 'LIKE',
    FOLLOW = 'FOLLOW',
}
@Entity({ name: 'notify' })
export class Notify {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @Column({ type: 'enum', enum: NotifyType })
    type!: string;

    @Column({ nullable: true })
    data!: string;
}

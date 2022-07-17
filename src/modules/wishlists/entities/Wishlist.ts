import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/users/entities';

export enum wishType {
    TOUR = 'TOUR',
    FORM = 'FORM',
}

@Entity({ name: 'wishlists' })
export class Wishlist {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @Column({ type: 'enum', enum: wishType })
    type!: string;

    @Column({ unsigned: true })
    targetId!: number;

    @ManyToOne(() => User, (user) => user.wishlists)
    user!: User;
}

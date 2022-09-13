import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WishlistFolder } from '@/modules/wishlists/entities/WishlistFolder';

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

    @ManyToOne(() => WishlistFolder, (wishlistFolder) => wishlistFolder.id)
    wishlistFolder!: WishlistFolder;
}

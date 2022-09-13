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

    @ManyToOne(() => WishlistFolder)
    wishlistFolder!: WishlistFolder;

    static from(folderId: number): Wishlist {
        const wishlist = new Wishlist();

        wishlist.wishlistFolder = new WishlistFolder();
        wishlist.wishlistFolder.id = folderId;

        return wishlist;
    }
}

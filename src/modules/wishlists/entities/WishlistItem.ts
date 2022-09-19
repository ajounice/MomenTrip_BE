import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WishlistFolder } from '@/modules/wishlists/entities/WishlistFolder';

export enum WishType {
    TOUR = 'TOUR',
    FORM = 'FORM',
}

@Entity({ name: 'wishlists' })
export class WishlistItem {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @Column({ type: 'enum', enum: WishType })
    type!: string;

    @Column({ unsigned: true })
    targetId!: number;

    @ManyToOne(() => WishlistFolder, { onDelete: 'CASCADE' })
    wishlistFolder!: WishlistFolder;

    static from(folderId: number): WishlistItem {
        const item = new WishlistItem();

        item.wishlistFolder = new WishlistFolder();
        item.wishlistFolder.id = folderId;

        return item;
    }
}

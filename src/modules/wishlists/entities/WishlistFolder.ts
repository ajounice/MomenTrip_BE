import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/users/entities';
import { WishlistItem } from '@/modules/wishlists/entities/WishlistItem';

@Entity({ name: 'wishlist_folders' })
export class WishlistFolder {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(() => User)
    user!: User;

    @OneToMany(() => WishlistItem, (wishlist) => wishlist.wishlistFolder, { onDelete: 'CASCADE' })
    wishlists!: WishlistItem[];

    static from(userId: number): WishlistFolder {
        const folder = new WishlistFolder();

        folder.user = new User();
        folder.user.id = userId;

        return folder;
    }
}

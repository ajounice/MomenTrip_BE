import { WishlistFolder } from '@/modules/wishlists/entities';

export class CreateWishlistFolderRequest {
    name!: string;

    toEntity(userId: number): WishlistFolder {
        const folder = WishlistFolder.from(userId);
        folder.name = this.name;
        return folder;
    }
}

import { WishlistFolder } from '@/modules/wishlists/entities';
import { IsNotEmpty } from 'class-validator';

export class CreateWishlistFolderRequest {
    @IsNotEmpty()
    name!: string;

    toEntity(userId: number): WishlistFolder {
        const folder = WishlistFolder.from(userId);
        folder.name = this.name;
        return folder;
    }
}

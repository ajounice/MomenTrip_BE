import { IsNotEmpty, IsString } from 'class-validator';
import { WishlistFolder } from '@/modules/wishlists/entities';

export class CreateWishlistFolderRequest {
    @IsNotEmpty()
    @IsString()
    name!: string;

    toEntity(): WishlistFolder {
        const folder = new WishlistFolder();

        folder.name = this.name;

        return folder;
    }
}

import { WishlistItem } from '@/modules/wishlists/entities';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
//import { ValidateNested } from 'class-validator';
//import { Type } from 'class-transformer';

export class CreateWishlistItemRequest {
    //@ValidateNested()
    //@Type(() => WishlistItem)
    //wishlist!: WishlistItem;
    @IsString()
    @IsNotEmpty()
    type!: string;

    @IsNumber()
    @IsNotEmpty()
    targetId!: number;

    toEntity(folderId: number): WishlistItem {
        const wishlist = WishlistItem.from(folderId);

        wishlist.type = this.type;
        wishlist.targetId = this.targetId;

        return wishlist;
    }
}

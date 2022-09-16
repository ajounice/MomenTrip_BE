import { WishlistItem, WishType } from '@/modules/wishlists/entities';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
//import { ValidateNested } from 'class-validator';

export class CreateWishlistItemRequest {
    //@ValidateNested()
    //@Type(() => WishlistItem)
    //wishlist!: WishlistItem;
    @IsEnum(WishType)
    @IsNotEmpty()
    type!: WishType;

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

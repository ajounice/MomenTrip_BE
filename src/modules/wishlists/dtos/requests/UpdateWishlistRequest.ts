import { Wishlist } from '@/modules/wishlists/entities';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
//import { ValidateNested } from 'class-validator';
//import { Type } from 'class-transformer';

export class UpdateWishlistRequest {
    //@ValidateNested()
    //@Type(() => Wishlist)
    //wishlist!: Wishlist;
    @IsString()
    @IsNotEmpty()
    type!: string;

    @IsNumber()
    @IsNotEmpty()
    targetId!: number;
    toEntity(folderId: number): Wishlist {
        const wishlist = Wishlist.from(folderId);

        wishlist.type = this.type;
        wishlist.targetId = this.targetId;

        return wishlist;
    }
}

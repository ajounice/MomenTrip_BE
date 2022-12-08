import { WishlistItem, WishType } from '@/modules/wishlists/entities';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWishlistItemRequest {
    @IsEnum(WishType)
    @IsNotEmpty()
    type!: WishType;

    @IsNumber()
    @IsNotEmpty()
    targetId!: number;

    toEntity(): WishlistItem {
        const item = new WishlistItem();

        item.type = this.type;
        item.targetId = this.targetId;

        return item;
    }
}

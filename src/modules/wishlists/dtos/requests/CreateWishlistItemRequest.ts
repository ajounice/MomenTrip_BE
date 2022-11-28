import { WishType } from '@/modules/wishlists/entities';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWishlistItemRequest {
    @IsEnum(WishType)
    @IsNotEmpty()
    type!: WishType;

    @IsNumber()
    @IsNotEmpty()
    targetId!: number;
}

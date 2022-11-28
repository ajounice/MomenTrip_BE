import { WishlistFolder, WishlistItem } from '@/modules/wishlists/entities';

export class WishlistItemResponse {
    public id: number;
    public type: string;
    public targetId: number;
    public folder: WishlistFolder;

    constructor(record: WishlistItem) {
        this.id = record.id;
        this.type = record.type;
        this.targetId = record.targetId;
        this.folder = record.wishlistFolder;
    }
}

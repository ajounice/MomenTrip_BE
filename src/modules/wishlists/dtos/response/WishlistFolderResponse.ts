import { WishlistFolder, WishlistItem } from '@/modules/wishlists/entities';

export class WishlistFolderResponse {
    public id: number;

    public name: string;

    public user: { id: number };

    public wishlists?: WishlistItem[];

    constructor(record: WishlistFolder) {
        this.id = record.id;
        this.name = record.name;
        this.user = record.user;
        this.wishlists = record?.wishlists || [];
    }
}

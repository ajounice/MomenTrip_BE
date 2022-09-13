import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '@/modules/wishlists/entities';

@Injectable()
export class WishlistService {
    constructor(
        @InjectRepository(Wishlist)
        private readonly wishlistRepository: Repository<Wishlist>,
    ) {}

    async findWishlist(userId: number, folderName: string, formId: number) {
        
    }

    async deleteWishlist(userId: number, folderName: string, formId: number) {
        
    }
}

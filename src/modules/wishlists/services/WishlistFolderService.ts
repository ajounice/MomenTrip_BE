import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistFolder } from '@/modules/wishlists/entities';
import { Repository } from 'typeorm';
import { CreateWishlistFolderRequest } from '@/modules/wishlists/dtos/requests';

@Injectable()
export class WishlistFolderService {
    constructor(
        @InjectRepository(WishlistFolder)
        private readonly wishlistFolderRepository: Repository<WishlistFolder>,
    ) {}

    getAllFolder(userId: number): Promise<WishlistFolder[]> {
        return this.wishlistFolderRepository.find({
            where: { user: { id: userId } },
            relations: ['user'],
        });
    }

    createFolder(userId: number, request: CreateWishlistFolderRequest) {
        const folder = request.toEntity(userId);
        console.log(folder);
        return this.wishlistFolderRepository.save(folder);
    }

    async deleteFolder(id: any, folderName: string) {}

    getAllWishlist(id: any, folderName: string) {}
}

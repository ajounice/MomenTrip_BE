import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistItem, WishlistFolder } from '@/modules/wishlists/entities';
import { Repository } from 'typeorm';
import {
    CreateWishlistFolderRequest,
    CreateWishlistItemRequest,
} from '@/modules/wishlists/dtos/requests';
import { ForbiddenException, NotFoundException } from '@/common/exceptions';

@Injectable()
export class WishlistFolderService {
    constructor(
        @InjectRepository(WishlistFolder)
        private readonly wishlistFolderRepository: Repository<WishlistFolder>,
    ) {}

    public async checkUser(userId: number, folderId: number) {
        const user = await this.wishlistFolderRepository.count({
            where: { id: folderId, user: { id: userId } },
        });
        if (user) {
            //유저의 wishlist folder가 맞을 시
            return true;
        }
        return false;
    }

    getAllFolder(userId: number): Promise<WishlistFolder[]> {
        return this.wishlistFolderRepository.find({
            where: { user: { id: userId } },
            relations: ['wishlists'],
        });
    }

    createFolder(userId: number, request: CreateWishlistFolderRequest): Promise<WishlistFolder> {
        const folder = request.toEntity(userId);
        return this.wishlistFolderRepository.save(folder);
    }

    async deleteFolder(userId: number, folderId: number) {
        const folder = await this.wishlistFolderRepository.findOne({
            where: { user: { id: userId }, id: folderId },
            relations: ['user'],
        });

        if (!folder) {
            throw new NotFoundException();
        }
        return this.wishlistFolderRepository.remove(folder);
    }
}

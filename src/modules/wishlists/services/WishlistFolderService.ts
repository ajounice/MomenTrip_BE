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
        @InjectRepository(WishlistItem)
        private readonly wishlistRepository: Repository<WishlistItem>,
    ) {}

    async checkUser(userId: number, folderId: number) {
        const user = await this.wishlistFolderRepository.count({
            where: { id: folderId, user: { id: userId } },
            //relations: ['user'],
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
        /*
        if (folder.user.id !== userId) {
            throw new ForbiddenException();
        }*/
        return this.wishlistFolderRepository.remove(folder);
    }

    async updateWishlist(userId: number, folderId: number, request: CreateWishlistItemRequest) {
        const isUser = this.checkUser(userId, folderId);
        if (!isUser) {
            throw new ForbiddenException();
        }

        const wishlist = request.toEntity(folderId);
        return await this.wishlistRepository.save(wishlist);
        //folder.wishlists.push(wishlist);
        //return this.wishlistFolderRepository.update(folderId, folder);
    }

    getAllWishlist(userId: number, folderId: number): Promise<WishlistItem[]> {
        const isUser = this.checkUser(userId, folderId);
        if (!isUser) {
            throw new ForbiddenException();
        }
        return this.wishlistRepository.find({
            where: { wishlistFolder: { id: folderId } },
            //relations: ['wishlistFolder'],
        });
    }

    async deleteWishlist(userId: number, folderId: number, wishId: number) {
        /*const isUser = await this.checkUser(userId, folderId);
        if (!isUser) {
            throw new ForbiddenException();
        }*/

        const wishlist = await this.wishlistRepository.findOne({
            where: { id: wishId, wishlistFolder: { id: folderId } },
            relations: ['wishlistFolder'],
        });
        console.log(wishlist);
        if (!wishlist) {
            throw new NotFoundException();
        }

        return this.wishlistRepository.remove(wishlist);
    }
}

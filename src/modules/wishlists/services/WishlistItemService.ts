import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistFolder, WishlistItem } from '@/modules/wishlists/entities';
import { Repository } from 'typeorm';
import { CreateWishlistItemRequest } from '@/modules/wishlists/dtos';
import { BadRequestException, ForbiddenException, NotFoundException } from '@/common/exceptions';
import { WishlistFolderService } from '@/modules/wishlists/services/WishlistFolderService';
import { TourInfoService } from '@/modules/tourInfos/services';
import { FormService } from '@/modules/forms/services';

@Injectable()
export class WishlistItemService {
    constructor(
        @InjectRepository(WishlistItem)
        private readonly wishlistItemRepository: Repository<WishlistItem>,
        private readonly wishlistFolderService: WishlistFolderService,
        private readonly tourInfoService: TourInfoService,
        private readonly formService: FormService,
    ) {}

    async createWishlistItem(userId: number, folderId: number, request: CreateWishlistItemRequest) {
        const isUser = this.wishlistFolderService.checkUser(userId, folderId);
        if (!isUser) {
            throw new ForbiddenException();
        }
        const { type, targetId } = request;
        const isDuplicated = await this.wishlistItemRepository.count({
            where: { type: type, targetId: targetId, wishlistFolder: { id: targetId } },
        });
        if (isDuplicated) {
            throw new ForbiddenException();
        }
        const wishlist = request.toEntity(folderId);
        return await this.wishlistItemRepository.save(wishlist);
        //folder.wishlists.push(wishlist);
        //return this.wishlistFolderRepository.update(folderId, folder);
    }

    async getWishlistItem(userId, folderId: number, wishId: number) {
        const isUser = this.wishlistFolderService.checkUser(userId, folderId);
        if (!isUser) {
            throw new ForbiddenException();
        }

        const item = await this.wishlistItemRepository.findOne({
            where: { id: wishId, wishlistFolder: { id: folderId } },
        });
        if (!item) {
            throw new NotFoundException();
        }

        if (item.type == 'TOUR') {
            return await this.tourInfoService.findById(item.targetId);
        } else if (item.type == 'FORM') {
            return await this.formService.findById(item.targetId);
        } else {
            throw new BadRequestException();
        }
    }
}

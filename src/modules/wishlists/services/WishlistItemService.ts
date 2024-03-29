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
        const { type, targetId } = request;
        const folder = await this.wishlistFolderService.findById(userId, folderId);
        const isDuplicated = await this.wishlistItemRepository.count({
            where: { type: type, targetId: targetId, wishlistFolder: { id: folderId } },
        });
        if (isDuplicated) {
            throw new ForbiddenException('Duplicated wishlist item');
        }
        const item = request.toEntity();
        item.targetId = targetId;
        item.type = type;
        item.wishlistFolder = folder;
        return await this.wishlistItemRepository.save(item);
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
            throw new NotFoundException('해당 item 존재하지 않음');
        }
        if (item.type == 'TOUR') {
            return await this.tourInfoService.findById(item.targetId);
        } else if (item.type == 'FORM') {
            return await this.formService.findById(item.targetId);
        } else {
            throw new BadRequestException('type 구분 안됨');
        }
    }

    getAllWishlistItem(userId: number, folderId: number): Promise<WishlistItem[]> {
        const isUser = this.wishlistFolderService.checkUser(userId, folderId);
        if (!isUser) {
            throw new ForbiddenException();
        }
        return this.wishlistItemRepository.find({
            where: { wishlistFolder: { id: folderId } },
        });
    }

    async deleteWishlistItem(userId: number, folderId: number, wishId: number) {
        const wishlist = await this.wishlistItemRepository.findOne({
            where: { id: wishId, wishlistFolder: { id: folderId } },
            relations: ['wishlistFolder'],
        });
        if (!wishlist) {
            throw new NotFoundException();
        }

        return this.wishlistItemRepository.remove(wishlist);
    }
}

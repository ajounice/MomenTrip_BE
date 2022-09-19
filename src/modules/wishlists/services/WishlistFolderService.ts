import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistItem, WishlistFolder } from '@/modules/wishlists/entities';
import { Repository } from 'typeorm';
import {
    CreateWishlistFolderRequest,
    CreateWishlistItemRequest,
} from '@/modules/wishlists/dtos/requests';
import { ForbiddenException, NotFoundException } from '@/common/exceptions';
import { FormService } from '@/modules/forms/services';
import { TourInfoService } from '@/modules/tourInfos/services';

@Injectable()
export class WishlistFolderService {
    constructor(
        @InjectRepository(WishlistFolder)
        private readonly wishlistFolderRepository: Repository<WishlistFolder>,
        private readonly formService: FormService,
        private readonly tourInfoService: TourInfoService,
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

    async getAllFolder(userId: number): Promise<WishlistFolder[]> {
        const folders = await this.wishlistFolderRepository.find({
            where: { user: { id: userId } },
            relations: ['wishlists'],
        });

        for (const folder of folders) {
            const formIds = folder.wishlists
                .filter((item) => item.type === 'FORM')
                .map((item) => item.targetId);
            const infoIds = folder.wishlists
                .filter((item) => item.type === 'INFO')
                .map((item) => item.targetId);

            const thumbnails = await this.formService.getThumbnailByIds(formIds);
            const images = await this.tourInfoService.getImageByIds(infoIds);

            folder.images = images.concat(thumbnails);
        }

        return folders;
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

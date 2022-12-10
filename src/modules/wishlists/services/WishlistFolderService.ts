import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistFolder } from '@/modules/wishlists/entities';
import { Repository } from 'typeorm';
import { CreateWishlistFolderRequest } from '@/modules/wishlists/dtos';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { FormService } from '@/modules/forms/services';
import { TourInfoService } from '@/modules/tourInfos/services';
import { User } from '@/modules/users/entities';

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

    public async findById(userId: number, folderId: number) {
        const folder = await this.wishlistFolderRepository.findOne({
            where: { user: { id: userId }, id: folderId },
        });

        return folder;
    }

    private async findByName(userId: number, name: string) {
        const folder = await this.wishlistFolderRepository.count({
            where: { name: name, user: { id: userId } },
        });
        if (folder) {
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

    async createFolder(user: User, request: CreateWishlistFolderRequest): Promise<WishlistFolder> {
        const isDuplicated = await this.findByName(user.id, request.name);
        if (isDuplicated) {
            //중복
            throw new BadRequestException('Duplicated folder name');
        }
        const folder = request.toEntity();
        folder.name = request.name;
        folder.user = user;
        return this.wishlistFolderRepository.save(folder);
    }

    async deleteFolder(userId: number, folderId: number) {
        const folder = await this.wishlistFolderRepository.findOne({
            where: { user: { id: userId }, id: folderId },
        });

        if (!folder) {
            throw new NotFoundException('Not exist folder');
        }
        return this.wishlistFolderRepository.remove(folder);
    }
}

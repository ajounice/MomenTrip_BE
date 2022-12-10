import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WishlistFolderService, WishlistItemService } from '@/modules/wishlists/services';
import { CreateWishlistFolderRequest, CreateWishlistItemRequest } from '@/modules/wishlists/dtos';
import { WishlistItem } from '@/modules/wishlists/entities';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { WishlistFolderResponse, WishlistItemResponse } from '@/modules/wishlists/dtos/response';

@UseGuards(AuthGuard('jwt'))
@Controller('wishlists')
export class WishlistController {
    constructor(
        private readonly wishlistFolderService: WishlistFolderService,
        private readonly wishlistItemService: WishlistItemService,
    ) {}

    @Get('/')
    getAllWishlistFolder(@Req() req) {
        const { id } = req.user;
        return this.wishlistFolderService.getAllFolder(id);
    }

    @Post('/new')
    async createWishlistFolder(@Req() req, @Body() request: CreateWishlistFolderRequest) {
        const { user } = req;
        const folder = await this.wishlistFolderService.createFolder(user, request);

        return new WishlistFolderResponse(folder);
    }

    @Delete('/:id')
    async deleteWishlistFolder(@Req() req, @Param('id') folderId: number) {
        const { id } = req.user;
        const result = await this.wishlistFolderService.deleteFolder(id, folderId);
        if (!result) {
            throw new BadRequestException();
        }
        return new WishlistFolderResponse(result);
    }

    @Get('/:id')
    getAllWishlistItem(@Req() req, @Param('id') folderId: number): Promise<WishlistItem[]> {
        const { id } = req.user;
        return this.wishlistItemService.getAllWishlistItem(id, folderId);
    }

    @Post('/:id')
    async createWishlistItem(
        @Req() req,
        @Param('id') folderId: number,
        @Body() request: CreateWishlistItemRequest,
    ) {
        const { user } = req;
        const folder = await this.wishlistFolderService.findById(user.id, folderId);
        if (!folder) {
            throw new NotFoundException('Not exist folder');
        }
        const item = await this.wishlistItemService.createWishlistItem(user.id, folderId, request);
        if (!item) {
            throw new BadRequestException();
        }
        return new WishlistItemResponse(item);
    }

    @Delete('/:folderId/:wishId')
    async deleteWishlistItem(
        @Req() req,
        @Param('folderId') folderId: number,
        @Param('wishId') wishId: number,
    ) {
        const { user } = req;
        const deletedWishlist = await this.wishlistItemService.deleteWishlistItem(
            user.id,
            folderId,
            wishId,
        );

        if (!deletedWishlist) {
            throw new BadRequestException();
        }
        return deletedWishlist;
    }

    //해당 폼으로 이동(FORM/TOUR)
    @Get('/:folderId/:wishId')
    async getWishlistItem(
        @Req() req,
        @Param('folderId') folderId: number,
        @Param('wishId') wishId: number,
    ) {
        const { user } = req;
        const item = await this.wishlistItemService.getWishlistItem(user.id, folderId, wishId);
        return item;
    }
}

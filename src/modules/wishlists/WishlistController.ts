import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WishlistFolderService, WishlistItemService } from '@/modules/wishlists/services';
import {
    CreateWishlistFolderRequest,
    CreateWishlistItemRequest,
    WishlistFolderResponse,
    WishlistItemResponse,
} from '@/modules/wishlists/dtos';
import { WishlistItem } from '@/modules/wishlists/entities';
import { BadRequestException } from '@/common/exceptions';

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
    async createWishlistFolder(
        @Req() req,
        @Body() createWishlistFolderRequest: CreateWishlistFolderRequest,
    ) {
        const { id } = req.user;
        const folder = await this.wishlistFolderService.createFolder(
            id,
            createWishlistFolderRequest,
        );

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
        const item = request;
        request = new CreateWishlistItemRequest();
        request = item;

        const folder = await this.wishlistItemService.createWishlistItem(
            req.user.id,
            folderId,
            request,
        );
        if (!folder) {
            throw new BadRequestException();
        }
        return folder;
    }

    @Delete('/:folderId/:wishId')
    async deleteWishlistItem(
        @Req() req,
        @Param('folderId') folderId: number,
        @Param('wishId') wishId: number,
    ) {
        const deletedWishlist = await this.wishlistItemService.deleteWishlistItem(
            req.user.id,
            folderId,
            wishId,
        );
        console.log(deletedWishlist);

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
        const item = await this.wishlistItemService.getWishlistItem(req.user.id, folderId, wishId);
        return item;
    }
}

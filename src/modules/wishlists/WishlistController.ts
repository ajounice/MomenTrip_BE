import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WishlistFolderService } from '@/modules/wishlists/services';
import { CreateWishlistFolderRequest, CreateWishlistItemRequest } from '@/modules/wishlists/dtos';
import { WishlistItem } from '@/modules/wishlists/entities';

@UseGuards(AuthGuard('jwt'))
@Controller('wishlists')
export class WishlistController {
    constructor(private readonly wishlistFolderService: WishlistFolderService) {}

    @Get('/')
    getAllFolder(@Req() req) {
        return this.wishlistFolderService.getAllFolder(req.user.id);
    }

    @Post('/new')
    async createFolder(@Req() req, @Body() request: CreateWishlistFolderRequest) {
        const folderName = request.name;
        request = new CreateWishlistFolderRequest();
        request.name = folderName;
        const folder = await this.wishlistFolderService.createFolder(req.user.id, request);

        if (!folder) {
            throw new BadRequestException();
        }
        return folder;
    }

    @Delete('/:id')
    async deleteFolder(@Req() req, @Param('id') folderId: number) {
        await this.wishlistFolderService.deleteFolder(req.user.id, folderId);
    }

    @Get('/:id')
    getAllWishlist(@Req() req, @Param('id') folderId: number): Promise<WishlistItem[]> {
        return this.wishlistFolderService.getAllWishlist(req.user.id, folderId);
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

        const folder = await this.wishlistFolderService.updateWishlist(
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
    async deleteWishlist(
        @Req() req,
        @Param('folderId') folderId: number,
        @Param('wishId') wishId: number,
    ) {
        const deletedWishlist = await this.wishlistFolderService.deleteWishlist(
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
}
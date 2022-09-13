import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WishlistFolderService, WishlistService } from '@/modules/wishlists/services';
import { CreateWishlistFolderRequest } from '@/modules/wishlists/dtos';

@UseGuards(AuthGuard('jwt'))
@Controller('wishlists')
export class WishlistController {
    constructor(
        private readonly wishlistService: WishlistService,
        private readonly wishlistFolderService: WishlistFolderService,
    ) {}

    @Get('/')
    getAllFolder(@Req() req) {
        return this.wishlistFolderService.getAllFolder(req.user.id);
    }

    @Post('/new')
    async createFolder(@Req() req, @Body() request: CreateWishlistFolderRequest) {
        const folderName = request.name;
        console.log(folderName);
        request = new CreateWishlistFolderRequest();
        request.name = folderName;
        console.log(request);
        const folder = await this.wishlistFolderService.createFolder(
            req.user.id,
            request
        );

        if (!folder) {
            throw new BadRequestException();
        }
        return folder;
    }

    @Delete('/:folder')
    async deleteFolder(@Req() req, @Param('folder') folderName: string) {
        await this.wishlistFolderService.deleteFolder(req.user.id, folderName);
    }

    @Get('/:folder')
    getAllWishlist(@Req() req, @Param('folder') folderName: string) {
        return this.wishlistFolderService.getAllWishlist(req.user.id, folderName);
    }

    @Get('/:folder/:id')
    async findWishlist(
        @Req() req,
        @Param('folder') folderName: string,
        @Param('id') formId: number,
    ) {
        return await this.wishlistService.findWishlist(req.user.id, folderName, formId);
    }

    @Delete('/:folder/:id')
    async deleteWishlist(
        @Req() req,
        @Res() res,
        @Param('folder') folderName: string,
        @Param('id') formId: number,
    ) {
        await this.wishlistService.deleteWishlist(req.user.id, folderName, formId);
        return res.redirect('/wishlists/');
    }
}

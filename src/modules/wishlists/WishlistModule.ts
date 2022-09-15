import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/modules/auth/AuthModule';
import { WishlistController } from '@/modules/wishlists/WishlistController';
import { WishlistFolderService } from '@/modules/wishlists/services';
import { WishlistItem, WishlistFolder } from '@/modules/wishlists/entities';

@Module({
    imports: [TypeOrmModule.forFeature([WishlistItem, WishlistFolder]), AuthModule],
    exports: [WishlistFolderService],
    controllers: [WishlistController],
    providers: [WishlistFolderService],
})
export class WishlistModule {}

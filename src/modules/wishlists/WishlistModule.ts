import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/modules/auth/AuthModule';
import { WishlistController } from '@/modules/wishlists/WishlistController';
import { WishlistFolderService, WishlistItemService } from '@/modules/wishlists/services';
import { WishlistItem, WishlistFolder } from '@/modules/wishlists/entities';
import { TourInfoModule } from '@/modules/tourInfos/TourInfoModule';
import { FormModule } from '@/modules/forms/FormModule';
import { TourInfo } from '@/modules/tourInfos/entities';
import { Form } from '@/modules/forms/entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([WishlistItem, WishlistFolder, Form, TourInfo]),
        AuthModule,
        TourInfoModule,
        FormModule,
    ],
    exports: [WishlistFolderService, WishlistItemService],
    controllers: [WishlistController],
    providers: [WishlistFolderService, WishlistItemService],
})
export class WishlistModule {}

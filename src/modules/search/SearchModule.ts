import { Module } from '@nestjs/common';
import { SearchController } from '@/modules/search/SearchController';
import { SearchService } from '@/modules/search/SearchService';
import { FormModule } from '@/modules/forms/FormModule';
import { TourInfoModule } from '@/modules/tourInfos/TourInfoModule';
import { UserModule } from '@/modules/users/UserModule';

@Module({
    imports: [FormModule, TourInfoModule, UserModule],
    controllers: [SearchController],
    providers: [SearchService],
})
export class SearchModule {}

import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '@/modules/search/SearchService';
import { SearchQuery } from '@/modules/search/dto';
import { Form } from '@/modules/forms/entities';
import { TagListResponse } from '@/modules/tags/dto';
import { TagService } from '@/modules/tags/TagService';

@Controller('search')
export class SearchController {
    constructor(
        private readonly searchService: SearchService,
        private readonly tagService: TagService,
    ) {}

    @Get('/')
    async search(@Query() query: SearchQuery) {
        console.log(query);
        const searchResult = await this.searchService.search(query);

        return searchResult;
    }

    @Get('/default')
    async getDefaultSearchData(): Promise<Form[]> {
        return this.searchService.getDefaultSearchData();
    }

    @Get('/best-tag')
    async getBestForm() {
        const result = await this.tagService.sortByViews();

        return new TagListResponse(result);
    }
}

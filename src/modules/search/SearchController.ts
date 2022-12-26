import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '@/modules/search/SearchService';
import { SearchQuery } from '@/modules/search/dto';
import { Form } from '@/modules/forms/entities';
import { FormListResponse } from '@/modules/forms/dtos/response';
import { FormService } from '@/modules/forms/services';

@Controller('search')
export class SearchController {
    constructor(
        private readonly searchService: SearchService,
        private readonly formService: FormService,
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

    @Get('/best-form')
    async getBestForm() {
        const result = await this.formService.sortByViews();

        return new FormListResponse(result);
    }
}

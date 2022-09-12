import { Injectable } from '@nestjs/common';
import { FormService } from '@/modules/forms/services';
import { TourInfoService } from '@/modules/tourInfos/services';
import { UserService } from '@/modules/users/UserService';
import { SearchQuery } from '@/modules/search/dto';
import { TourInfo } from '@/modules/tourInfos/entities';
import { User } from '../users/entities';
import { Form } from '@/modules/forms/entities';

@Injectable()
export class SearchService {
    constructor(
        private readonly formService: FormService,
        private readonly tourInfoService: TourInfoService,
        private readonly userService: UserService,
    ) {}

    async search(query: SearchQuery): Promise<TourInfo[] | User[] | Form[]> {
        if (query.type === 'user') {
            return await this.userService.filterByNickname(query.tag);
        }
        if (query.type === 'form') {
            let tag: any[];
            if (query.tag) {
                tag = query.tag.split(',');
            }
            return await this.formService.getAll({ tag });
        }

        return [];
    }

    async getDefaultSearchData(): Promise<Form[]> {
        return this.formService.getAll();
    }
}

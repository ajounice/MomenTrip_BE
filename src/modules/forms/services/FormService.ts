import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Form } from '@/modules/forms/entities';
import { TagService } from '@/modules/tags/TagService';
import { CommonService } from '@/modules/common/CommonService';
import { TourInfoService } from '@/modules/tourInfos/services';
import { SaveFormRequest } from '@/modules/forms/dtos';
import { BadRequestException } from '@/common/exceptions';
import { User } from '@/modules/users/entities';

@Injectable()
export class FormService {
    private MAXIMUM_FORM_VIDEO_SIZE = 41943040; // 40MB

    constructor(
        @InjectRepository(Form)
        private readonly formRepository: Repository<Form>,
        private readonly tagService: TagService,
        private readonly commonService: CommonService,
        private readonly tourInfoService: TourInfoService,
    ) {}

    public async getAll(query?: { tag: string[] }): Promise<Form[]> {
        if (query?.tag) {
            const tmp = await this.formRepository.find({
                where: { tags: { name: In(query.tag) } },
                relations: ['tags', 'user'],
            });

            const ids = tmp.map((form) => form.id);

            return this.formRepository.find({ where: { id: In(ids) }, relations: ['tags'] });
        }

        return this.formRepository.find({ relations: ['tags', 'user'] });
    }

    async sortByViews(): Promise<Form[]> {
        const [list, count] = await this.formRepository.findAndCount({
            order: { viewCount: 'DESC' },
        });
        return list;
    }

    public async findById(id: number): Promise<Form> {
        const form = await this.formRepository.findOne({
            where: { id },
            relations: ['tags', 'user', 'tourInfo'],
        });
        const viewsIncreased = await this.formRepository.increment({ id }, 'viewCount', 1);
        return form;
    }

    public async saveForm(body: SaveFormRequest, video: Express.Multer.File, user: User) {
        const entity = body.toEntity();

        const { path: thumbnailPath } = await this.commonService.uploadThumbnail(video);

        const { path: convertedVideoPath } = await this.commonService.convert(video);

        const info = await this.tourInfoService.findByName(body.site);

        if (!info) {
            const createdInfo = await this.tourInfoService.createInfo(body.site);

            if (!createdInfo) {
                throw new BadRequestException();
            }
            entity.tourInfo = createdInfo;
        } else {
            entity.tourInfo = info;
        }

        entity.tags = [];

        const tags = body.tag.split(',');

        if (tags.length) {
            for (const tag of tags) {
                const tagEntity = await this.tagService.saveTag(tag);

                entity.tags.push(tagEntity);
            }
        }

        entity.video = convertedVideoPath;

        entity.thumbnail = thumbnailPath;

        entity.user = user;

        return this.formRepository.save(entity);
    }

    public async getThumbnailByIds(ids: number[]): Promise<string[]> {
        const forms = await this.formRepository.find({ where: { id: In(ids) } });

        return forms.map((form) => form.thumbnail);
    }
}

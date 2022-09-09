import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from '@/modules/forms/entities';
import { TagService } from '@/modules/tags/TagService';
import { CommonService } from '@/modules/common/CommonService';
import { TourInfoService } from '@/modules/tourInfos/services';
import { SaveFormRequest } from '@/modules/forms/dtos';
import { BadRequestException } from '@/common/exceptions';

@Injectable()
export class FormService {
    constructor(
        @InjectRepository(Form)
        private readonly formRepository: Repository<Form>,
        private readonly tagService: TagService,
        private readonly commonService: CommonService,
        private readonly tourInfoService: TourInfoService,
    ) {}

    public getAll(): Promise<Form[]> {
        return this.formRepository.find();
    }

    public findById(id: number): Promise<Form> {
        return this.formRepository.findOne({ where: { id } });
    }

    public async saveForm(body: SaveFormRequest, video: Express.Multer.File) {
        const entity = body.toEntity();

        const path = await this.commonService.upload(video, 'videos');

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

        entity.video = path;

        return this.formRepository.save(entity);
    }
}

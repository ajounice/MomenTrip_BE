import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '@/modules/tags/entities/Tag';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) {}

    public async findByName(name: string): Promise<Tag | null> {
        return this.tagRepository.findOne({ where: { name } });
    }

    public async saveTag(name: string): Promise<Tag> {
        const isExist = await this.findByName(name);

        if (!isExist) {
            const tag = new Tag();

            tag.name = name;
            return this.tagRepository.save(tag);
        }

        return isExist;
    }

    public async sortByViews(): Promise<Tag[]> {
        const [list, count] = await this.tagRepository.findAndCount({
            order: { viewCount: 'DESC' },
        });
        return list;
    }
}

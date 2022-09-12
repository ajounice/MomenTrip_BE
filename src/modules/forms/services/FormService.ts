import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Form } from '@/modules/forms/entities';
import { TagService } from '@/modules/tags/TagService';

@Injectable()
export class FormService {
    constructor(
        @InjectRepository(Form)
        private readonly formRepository: Repository<Form>,
        private readonly tagService: TagService,
    ) {}

    public async getAll(query?: { tag: string[] }): Promise<Form[]> {
        const queryBuilder = this.formRepository
            .createQueryBuilder('form')
            .select()
            .leftJoinAndSelect('form.tags', 'tags');
        if (query.tag) {
            queryBuilder.andWhere('tags.name in (:tag)', {
                tag: query.tag,
            });

            const ids = (await queryBuilder.getMany()).map((v) => v.id);

            return this.formRepository.find({
                where: { id: In(ids) },
                relations: ['tags'],
            });
        }
        return queryBuilder.getMany();
    }

    public findById(id: number): Promise<Form> {
        return this.formRepository.findOne({ where: { id } });
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from '@/modules/forms/entities';
import { TagService } from '@/modules/tags/TagService';

@Injectable()
export class FormService {
    constructor(
        @InjectRepository(Form)
        private readonly formRepository: Repository<Form>,
        private readonly tagService: TagService,
    ) {}

    public getAll(): Promise<Form[]> {
        return this.formRepository.find();
    }

    public findById(id: number): Promise<Form> {
        return this.formRepository.findOne({ where: { id } });
    }
}

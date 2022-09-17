import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormLike } from '@/modules/forms/entities';
import { Repository } from 'typeorm';

@Injectable()
export class FormLikeService {
    constructor(
        @InjectRepository(FormLike)
        private readonly formLikeRepository: Repository<FormLike>,
    ) {}

    private findLike(userId: number, formId: number) {
        return this.formLikeRepository.findOne({
            where: { user: { id: userId }, form: { id: formId } },
        });
    }

    async like(userId: number, id: number) {
        const exists = await this.findLike(userId, id);

        if (exists) {
            await this.formLikeRepository.remove(exists);
            return false;
        }
        const like = FormLike.from(userId, id);

        await this.formLikeRepository.save(like);
        return true;
    }
}

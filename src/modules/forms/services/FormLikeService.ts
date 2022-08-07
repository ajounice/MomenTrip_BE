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

    async like(user: { id: number }, id: number) {
        const exists = await this.findLike(user.id, id);

        if (exists) {
            await this.formLikeRepository.remove(exists);
            return false;
        }
        const like = FormLike.from(user.id, id);

        await this.formLikeRepository.save(like);
        return true;
    }
}

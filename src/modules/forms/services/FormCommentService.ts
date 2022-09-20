import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormComment } from '@/modules/forms/entities';
import { Repository } from 'typeorm';
import { SaveFormCommentRequest, UpdateFormCommentRequest } from '@/modules/forms/dtos';
import { ForbiddenException, NotFoundException } from '@/common/exceptions';

@Injectable()
export class FormCommentService {
    constructor(
        @InjectRepository(FormComment)
        private readonly formCommentRepository: Repository<FormComment>,
    ) {}

    getCommentsByFormId(formId: number): Promise<FormComment[]> {
        return this.formCommentRepository.find({
            where: { form: { id: formId } },
            relations: ['form', 'user'],
        });
    }

    saveComment(formId: number, userId: number, request: SaveFormCommentRequest) {
        console.log(request);
        const comment = request.toEntity(userId, formId);
        console.log(comment);
        return this.formCommentRepository.save(comment);
    }

    async updateComment(commentId: number, userId: number, request: UpdateFormCommentRequest) {
        const comment = await this.formCommentRepository.findOne({
            where: { id: commentId },
            relations: ['user'],
        });

        if (!comment) {
            throw new NotFoundException();
        }

        if (comment.user.id !== userId) {
            throw new ForbiddenException();
        }

        comment.content = request.content;

        return this.formCommentRepository.save(comment);
    }

    async deleteComment(commentId: number, userId: number) {
        const comment = await this.formCommentRepository.findOne({
            where: { id: commentId },
            relations: ['user'],
        });

        if (!comment) {
            throw new NotFoundException();
        }

        if (comment.user.id !== userId) {
            throw new ForbiddenException();
        }

        return this.formCommentRepository.remove(comment);
    }
}

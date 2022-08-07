import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TourInfoComment } from '@/modules/tourInfos/entities';
import { Repository } from 'typeorm';
import { SaveTourInfoCommentRequest, UpdateTourInfoCommentRequest } from '@/modules/tourInfos/dto';
import { ForbiddenException, NotFoundException } from '@/common/exceptions';

@Injectable()
export class TourInfoCommentService {
    constructor(
        @InjectRepository(TourInfoComment)
        private readonly tourInfoCommentRepository: Repository<TourInfoComment>,
    ) {}

    getCommentsByInfoId(infoId: number): Promise<TourInfoComment[]> {
        return this.tourInfoCommentRepository.find({
            where: { tourInfo: { id: infoId } },
            relations: ['tourInfo', 'user'],
        });
    }

    saveComment(infoId: number, userId: number, request: SaveTourInfoCommentRequest) {
        const comment = request.toEntity(userId, infoId);

        return this.tourInfoCommentRepository.save(comment);
    }

    async updateComment(commentId: number, userId: number, request: UpdateTourInfoCommentRequest) {
        const comment = await this.tourInfoCommentRepository.findOne({
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

        return this.tourInfoCommentRepository.save(comment);
    }

    async deleteComment(commentId: number, userId: number) {
        const comment = await this.tourInfoCommentRepository.findOne({
            where: { id: commentId },
            relations: ['user'],
        });

        if (!comment) {
            throw new NotFoundException();
        }

        if (comment.user.id !== userId) {
            throw new ForbiddenException();
        }

        return this.tourInfoCommentRepository.remove(comment);
    }
}

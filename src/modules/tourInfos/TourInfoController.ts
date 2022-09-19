import { Controller, Get, Param, Post, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { TourInfoLikeService, TourInfoService } from '@/modules/tourInfos/services';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { TourInfoCommentService } from '@/modules/tourInfos/services/TourInfoCommentService';
import { SaveTourInfoCommentRequest, UpdateTourInfoCommentRequest } from '@/modules/tourInfos/dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('tourInfo')
export class TourInfoController {
    constructor(
        private readonly tourInfoService: TourInfoService,
        private readonly tourInfoLikeService: TourInfoLikeService,
        private readonly tourInfoCommentService: TourInfoCommentService,
    ) {}

    @Get('/')
    getAllTourInfo() {
        return this.tourInfoService.getAll();
    }

    @Get('/:id')
    async findById(@Param('id') id: number) {
        const info = await this.tourInfoService.findById(id);
        if (!info) {
            throw new NotFoundException();
        }
        return info;
    }

    @Post('/:id/like')
    async likeTourInfo(@Param('id') id: number) {
        const user = { id: 1 };

        const likeResult = await this.tourInfoLikeService.like(user, id);

        if (!likeResult) {
            throw new BadRequestException();
        }

        return likeResult;
    }

    @Get('/:id/comments')
    async getCommentsByInfoId(@Param('id') id: number) {
        return this.tourInfoCommentService.getCommentsByInfoId(id);
    }

    @Post('/:id/comments')
    async saveCommentToTourInfo(
        @Param('id') id: number,
        @Body() request: SaveTourInfoCommentRequest,
    ) {
        const user = { id: 1 };

        const content = request.content;

        request = new SaveTourInfoCommentRequest();
        request.content = content;

        const comment = await this.tourInfoCommentService.saveComment(id, user.id, request);

        if (!comment) {
            throw new BadRequestException();
        }

        return comment;
    }

    @Patch('/comments/:commentId')
    async updateTourInfoComment(
        @Param('commentId') commentId: number,
        @Body() request: UpdateTourInfoCommentRequest,
    ) {
        const user = { id: 1 };

        const updatedComment = await this.tourInfoCommentService.updateComment(
            commentId,
            user.id,
            request,
        );

        if (!updatedComment) {
            throw new BadRequestException();
        }

        return updatedComment;
    }

    @Delete('/comments/:commentId')
    async deleteTourInfoComment(@Param('commentId') commentId: number) {
        const user = { id: 1 };

        const deletedComment = await this.tourInfoCommentService.deleteComment(commentId, user.id);

        if (!deletedComment) {
            throw new BadRequestException();
        }

        return deletedComment;
    }
}

import { Controller, Get, Param, Post, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { TourInfoLikeService, TourInfoService } from '@/modules/tourInfos/services';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { TourInfoCommentService } from '@/modules/tourInfos/services/TourInfoCommentService';
import { SaveTourInfoCommentRequest, UpdateTourInfoCommentRequest } from '@/modules/tourInfos/dto';
import { AuthGuard } from '@nestjs/passport';
import {
    TourInfoCommentListResponse,
    TourInfoCommentResponse,
    TourInfoListResponse,
    TourInfoResponse,
} from '@/modules/tourInfos/dto/response';

@UseGuards(AuthGuard('jwt'))
@Controller('tourInfo')
export class TourInfoController {
    constructor(
        private readonly tourInfoService: TourInfoService,
        private readonly tourInfoLikeService: TourInfoLikeService,
        private readonly tourInfoCommentService: TourInfoCommentService,
    ) {}

    @Get('/')
    async getAllTourInfo() {
        const list = await this.tourInfoService.getAll();

        return new TourInfoListResponse(list);
    }

    @Get('/:id')
    async findById(@Param('id') id: number) {
        const info = await this.tourInfoService.findById(id);
        if (!info) {
            throw new NotFoundException();
        }
        return new TourInfoResponse(info);
    }

    @Post('/:id/like')
    async likeTourInfo(@Param('id') id: number) {
        const user = { id: 1 };

        const likeResult = await this.tourInfoLikeService.like(user, id);

        if (!likeResult) {
            throw new BadRequestException();
        }

        return { status: likeResult };
    }

    @Get('/:id/comments')
    async getCommentsByInfoId(@Param('id') id: number) {
        const result = await this.tourInfoCommentService.getCommentsByInfoId(id);

        return new TourInfoCommentListResponse(result);
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

        const result = await this.tourInfoCommentService.saveComment(id, user.id, request);

        if (!result) {
            throw new BadRequestException();
        }

        return new TourInfoCommentResponse(result);
    }

    @Patch('/comments/:commentId')
    async updateTourInfoComment(
        @Param('commentId') commentId: number,
        @Body() request: UpdateTourInfoCommentRequest,
    ) {
        const user = { id: 1 };

        const result = await this.tourInfoCommentService.updateComment(commentId, user.id, request);

        if (!result) {
            throw new BadRequestException();
        }

        return new TourInfoCommentResponse(result);
    }

    @Delete('/comments/:commentId')
    async deleteTourInfoComment(@Param('commentId') commentId: number) {
        const user = { id: 1 };

        const result = await this.tourInfoCommentService.deleteComment(commentId, user.id);

        if (!result) {
            throw new BadRequestException();
        }

        return new TourInfoCommentResponse(result);
    }
}

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FormService } from '@/modules/forms/services/FormService';
import { join } from 'path';
import { createReadStream } from 'fs';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { FormCommentService, FormLikeService } from '@/modules/forms/services';
import { SaveFormCommentRequest, UpdateFormCommentRequest } from '@/modules/forms/dtos';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('forms')
export class FormController {
    constructor(
        private readonly formService: FormService,
        private readonly formLikeService: FormLikeService,
        private readonly formCommentService: FormCommentService,
    ) {}

    @Get('/')
    @UseGuards(AuthGuard('jwt'))
    getAll() {
        return this.formService.getAll();
    }

    @Post('/')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('video'))
    async saveForm(@Body() body, @UploadedFile() video: Express.Multer.File) {
        console.log(body);
        console.log(video);

        const createdForm = await this.formService.saveForm(body, video);

        if (!createdForm) {
            console.log('failed');
        } else {
            return 'success';
        }
    }

    @Get('/:id')
    @UseGuards(AuthGuard('jwt'))
    async findById(@Param('id') id: number) {
        const form = await this.formService.findById(id);
        if (!form) {
            throw new NotFoundException();
        }
        return form;
    }

    @Get('/:id/video')
    @UseGuards(AuthGuard('jwt'))
    findVideoById(@Param('id') id: number): StreamableFile {
        const file = createReadStream(join(process.cwd(), '..', `test${id}.mp4`));

        return new StreamableFile(file);
    }

    @Post('/:id/like')
    @UseGuards(AuthGuard('jwt'))
    async likeForm(@Param('id') id: number) {
        // TODO: 유저 세션 관련 작업이 완료된 후 해당 세션을 사용하도록 변경해야 함
        const user = { id: 1 };

        const likeResult = this.formLikeService.like(user, id);

        if (!likeResult) {
            throw new BadRequestException();
        }

        return likeResult;
    }

    @Get('/:id/comments')
    @UseGuards(AuthGuard('jwt'))
    async getCommentsByFormId(@Param('id') id: number) {
        return this.formCommentService.getCommentsByFormId(id);
    }

    @Post('/:id/comments')
    @UseGuards(AuthGuard('jwt'))
    async saveCommentToForm(@Param('id') id: number, @Body() request: SaveFormCommentRequest) {
        // TODO: 유저 세션 관련 작업이 완료된 후 해당 세션을 사용하도록 변경해야 함
        const user = { id: 1 };

        const content = request.content;

        request = new SaveFormCommentRequest();
        request.content = content;

        const comment = await this.formCommentService.saveComment(id, user.id, request);

        if (!comment) {
            throw new BadRequestException();
        }

        return comment;
    }

    @Patch('/comments/:commentId')
    @UseGuards(AuthGuard('jwt'))
    async updateFormComment(
        @Param('commentId') commentId: number,
        @Body() request: UpdateFormCommentRequest,
    ) {
        // TODO: 유저 세션 관련 작업이 완료된 후 해당 세션을 사용하도록 변경해야 함
        const user = { id: 1 };

        const updatedComment = await this.formCommentService.updateComment(
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
    @UseGuards(AuthGuard('jwt'))
    async deleteFormComment(@Param('commentId') commentId: number) {
        // TODO: 유저 세션 관련 작업이 완료된 후 해당 세션을 사용하도록 변경해야 함
        const user = { id: 1 };

        const deletedComment = await this.formCommentService.deleteComment(commentId, user.id);

        if (!deletedComment) {
            throw new BadRequestException();
        }

        return deletedComment;
    }
}

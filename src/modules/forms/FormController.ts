import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FormService } from '@/modules/forms/services/FormService';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { FormCommentService, FormLikeService } from '@/modules/forms/services';
import {
    SaveFormCommentRequest,
    SaveFormRequest,
    UpdateFormCommentRequest,
} from '@/modules/forms/dtos';
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
    async saveForm(
        @Req() req,
        @Body() body: SaveFormRequest,
        @UploadedFile() video: Express.Multer.File,
    ) {
        const { user } = req;
        const createdForm = await this.formService.saveForm(body, video, user);

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

    @Post('/:id/like')
    @UseGuards(AuthGuard('jwt'))
    async likeForm(@Req() req, @Param('id') id: number) {
        const { id: userId } = req.user;

        const likeResult = this.formLikeService.like(userId, id);

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
    async saveCommentToForm(
        @Req() req,
        @Param('id') id: number,
        @Body() request: SaveFormCommentRequest,
    ) {
        // TODO: 유저 세션 관련 작업이 완료된 후 해당 세션을 사용하도록 변경해야 함
        const { id: userId } = req.user;

        const content = request.content;

        request = new SaveFormCommentRequest();
        request.content = content;

        const comment = await this.formCommentService.saveComment(id, userId, request);

        if (!comment) {
            throw new BadRequestException();
        }

        return comment;
    }

    @Patch('/comments/:commentId')
    @UseGuards(AuthGuard('jwt'))
    async updateFormComment(
        @Req() req,
        @Param('commentId') commentId: number,
        @Body() request: UpdateFormCommentRequest,
    ) {
        const { id } = req.user;

        const updatedComment = await this.formCommentService.updateComment(commentId, id, request);

        if (!updatedComment) {
            throw new BadRequestException();
        }

        return updatedComment;
    }

    @Delete('/comments/:commentId')
    @UseGuards(AuthGuard('jwt'))
    async deleteFormComment(@Req() req, @Param('commentId') commentId: number) {
        // TODO: 유저 세션 관련 작업이 완료된 후 해당 세션을 사용하도록 변경해야 함
        const { id } = req.user;

        const deletedComment = await this.formCommentService.deleteComment(commentId, id);

        if (!deletedComment) {
            throw new BadRequestException();
        }

        return deletedComment;
    }
}

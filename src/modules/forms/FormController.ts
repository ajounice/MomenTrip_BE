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
import {
    FormCommentListResponse,
    FormCommentResponse,
    FormListResponse,
    FormResponse,
} from '@/modules/forms/dtos/response';
import { NotificationService } from '@/modules/notification/NotificationService';

@UseGuards(AuthGuard('jwt'))
@Controller('forms')
export class FormController {
    constructor(
        private readonly formService: FormService,
        private readonly formLikeService: FormLikeService,
        private readonly formCommentService: FormCommentService,
        private readonly notificationService: NotificationService,
    ) {}

    @Get('/')
    async getAll() {
        const result = await this.formService.getAll();

        return new FormListResponse(result);
    }

    @Post('/')
    @UseInterceptors(FileInterceptor('video'))
    async saveForm(
        @Req() req,
        @Body() body: SaveFormRequest,
        @UploadedFile() video: Express.Multer.File,
    ) {
        const { user } = req;
        const result = await this.formService.saveForm(body, video, user);

        if (!result) {
            throw new BadRequestException('Failed to save form');
        } else {
            return new FormResponse(result);
        }
    }

    @Get('/:id')
    async findById(@Param('id') id: number) {
        const result = await this.formService.findById(id);
        if (!result) {
            throw new NotFoundException();
        }
        return new FormResponse(result);
    }

    @Post('/:id/like')
    async likeForm(@Req() req, @Param('id') id: number) {
        const { id: userId } = req.user;

        const likeResult = await this.formLikeService.like(userId, id);
        const form = await this.formService.findById(id);
        if (likeResult) {
            const type = 'LIKE';
            await this.notificationService.saveNotification(type, id, form.user);
        }
        return { status: likeResult };
    }

    @Get('/:id/comments')
    async getCommentsByFormId(@Param('id') id: number) {
        const result = await this.formCommentService.getCommentsByFormId(id);

        return new FormCommentListResponse(result);
    }

    @Post('/:id/comments')
    async saveCommentToForm(
        @Req() req,
        @Param('id') id: number,
        @Body() request: SaveFormCommentRequest,
    ) {
        const { id: userId } = req.user;

        const result = await this.formCommentService.saveComment(id, userId, request);

        if (!result) {
            throw new BadRequestException();
        }
        const type = 'COMMENT';
        await this.notificationService.saveNotification(type, id, result.form.user);

        return new FormCommentResponse(result);
    }

    @Patch('/comments/:commentId')
    async updateFormComment(
        @Req() req,
        @Param('commentId') commentId: number,
        @Body() request: UpdateFormCommentRequest,
    ) {
        const { id } = req.user;

        const result = await this.formCommentService.updateComment(commentId, id, request);
        if (!result) {
            throw new BadRequestException();
        }

        const type = 'COMMENT';
        await this.notificationService.saveNotification(type, id, result.form.user);

        return new FormCommentResponse(result);
    }

    @Delete('/comments/:commentId')
    async deleteFormComment(@Req() req, @Param('commentId') commentId: number) {
        // TODO: 유저 세션 관련 작업이 완료된 후 해당 세션을 사용하도록 변경해야 함
        const { id } = req.user;

        const result = await this.formCommentService.deleteComment(commentId, id);

        if (!result) {
            throw new BadRequestException();
        }

        return new FormCommentResponse(result);
    }
}

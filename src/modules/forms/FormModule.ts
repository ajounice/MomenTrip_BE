import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Form, FormLike, FormComment } from '@/modules/forms/entities';
import { FormController } from './FormController';
import { FormService, FormCommentService, FormLikeService } from '@/modules/forms/services';
import { TagModule } from '@/modules/tags/TagModule';

@Module({
    imports: [TypeOrmModule.forFeature([Form, FormLike, FormComment]), TagModule],
    controllers: [FormController],
    providers: [FormService, FormLikeService, FormCommentService],
    exports: [FormService, FormLikeService, FormCommentService, TypeOrmModule],
})
export class FormModule {}

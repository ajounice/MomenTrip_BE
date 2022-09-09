import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Form, FormLike, FormComment } from '@/modules/forms/entities';
import { FormController } from './FormController';
import { FormService, FormCommentService, FormLikeService } from '@/modules/forms/services';
import { TagModule } from '@/modules/tags/TagModule';
import { CommonModule } from '@/modules/common/CommonModule';
import { TourInfoModule } from '@/modules/tourInfos/TourInfoModule';

@Module({
    imports: [
        TypeOrmModule.forFeature([Form, FormLike, FormComment]),
        TagModule,
        CommonModule,
        TourInfoModule,
    ],
    controllers: [FormController],
    providers: [FormService, FormLikeService, FormCommentService],
})
export class FormModule {}

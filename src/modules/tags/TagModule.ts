import { Module } from '@nestjs/common';
import { TagService } from '@/modules/tags/TagService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '@/modules/tags/entities/Tag';

@Module({
    exports: [TagService],
    imports: [TypeOrmModule.forFeature([Tag])],
    providers: [TagService],
})
export class TagModule {}

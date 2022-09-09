import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tag } from '@/modules/tags/entities/Tag';
import { TourInfoComment } from '@/modules/tourInfos/entities/TourInfoComment';
import { TourInfoLike } from '@/modules/tourInfos/entities/TourInfoLike';
import { Form } from '@/modules/forms/entities';

export enum placeType {
    CITY = 'CITY',
    MOUNTAIN = 'MOUNTAIN',
    SEA = 'SEA',
}

@Entity({ name: 'tour_infos' })
export class TourInfo {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @Column({ type: 'enum', enum: placeType })
    type!: string;

    @Column({ nullable: false })
    name!: string;

    @Column({ type: 'point' })
    place!: any;

    @Column({ default: 0 })
    price!: number;

    @Column({ default: 0 })
    viewCount!: number;

    @OneToMany(() => TourInfoComment, (tourInfoComment) => tourInfoComment.tourInfo)
    comments!: TourInfoComment[];

    @OneToMany(() => TourInfoLike, (tourInfoLike) => tourInfoLike.tourInfo)
    likes!: TourInfoLike[];

    @JoinTable({
        name: 'tourinfos_tags',
        joinColumn: {
            name: 'tourInfo_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'tag_id',
            referencedColumnName: 'id',
        },
    })
    @ManyToMany(() => Tag)
    tags!: Tag[];

    @OneToMany(() => Form, (form) => form.tourInfo)
    tourInfos!: TourInfo[];
}

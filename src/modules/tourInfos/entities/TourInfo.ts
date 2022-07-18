import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

    @Column()
    price!: number;

    @Column({ default: 0 })
    viewCount!: number;
}

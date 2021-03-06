import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'forms' })
export class Form {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @Column({ nullable: true })
    content!: string;

    @Column({ nullable: true })
    title!: string;

    @Column()
    thumbnail!: string;

    @Column()
    video!: string;

    @Column({ default: 0 })
    viewCount!: number;
}

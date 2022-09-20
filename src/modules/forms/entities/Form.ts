import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from '@/modules/tags/entities/Tag';
import { FormComment } from '@/modules/forms/entities/FormComment';
import { FormLike } from '@/modules/forms/entities/FormLike';
import { TourInfo } from '@/modules/tourInfos/entities';
import { User } from '@/modules/users/entities';

@Entity({ name: 'forms' })
export class Form {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @Column({ nullable: true })
    content!: string;

    @Column({ nullable: true })
    title!: string;

    @Column({ default: null })
    thumbnail!: string;

    @Column({ nullable: false })
    video!: string;

    @Column({ default: 0 })
    viewCount!: number;

    @OneToMany(() => FormComment, (formComment) => formComment.form)
    comments!: FormComment[];

    @OneToMany(() => FormLike, (formLike) => formLike.form)
    likes!: FormLike[];

    @JoinTable({
        name: 'forms_tags',
        joinColumn: {
            name: 'form_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'tag_id',
            referencedColumnName: 'id',
        },
    })
    @ManyToMany(() => Tag)
    tags!: Tag[];

    @ManyToOne(() => TourInfo)
    tourInfo!: TourInfo;

    @ManyToOne(() => User)
    user!: User;
}

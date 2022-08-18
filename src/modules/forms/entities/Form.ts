import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tag } from '@/modules/tags/entities/Tag';
import { FormComment } from '@/modules/forms/entities/FormComment';
import { FormLike } from '@/modules/forms/entities/FormLike';

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
}

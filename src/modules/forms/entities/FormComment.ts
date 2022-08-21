import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/users/entities';
import { Form } from '@/modules/forms/entities/Form';

@Entity({ name: 'form_comments' })
export class FormComment {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @Column()
    content!: string;

    @ManyToOne(() => User)
    user!: User;

    @ManyToOne(() => Form)
    form!: Form;

    static from(userId: number, formId: number) {
        const comment = new FormComment();
        comment.user = new User();
        comment.form = new Form();

        comment.user.id = userId;
        comment.form.id = formId;

        return comment;
    }
}

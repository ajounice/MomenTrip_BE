import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/users/entities';
import { Form } from '@/modules/forms/entities/Form';

@Entity({ name: 'form_likes' })
export class FormLike {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @ManyToOne(() => Form)
    form!: Form;

    static from(userId: number, formId: number) {
        const like = new FormLike();

        like.form = new Form();
        like.user = new User();

        like.form.id = formId;
        like.user.id = userId;

        return like;
    }
}

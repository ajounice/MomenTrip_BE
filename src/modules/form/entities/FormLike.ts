import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/users/entities';
import { Form } from '@/modules/form/entities/Form';

@Entity({ name: 'form_likes' })
export class FormLike {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @ManyToOne(() => Form)
    form!: Form;
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/users/entities';

@Entity({ name: 'form_comments' })
export class FormComment {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @Column()
    content!: string;

    @ManyToOne(() => User)
    user!: User;
}

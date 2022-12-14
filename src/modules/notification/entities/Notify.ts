import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/users/entities';

@Entity({ name: 'notify' })
export class Notify {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @Column({ nullable: false })
    type!: string;

    @ManyToOne(() => User, (user) => user.Notify, { onDelete: 'CASCADE' })
    @JoinColumn()
    target!: User;
}

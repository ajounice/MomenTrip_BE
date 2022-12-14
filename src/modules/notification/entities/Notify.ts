import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/users/entities';

@Entity({ name: 'notify' })
export class Notify {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @ManyToOne(() => User)
    @JoinColumn()
    user!: User;

    @Column({ nullable: false })
    type!: string;

    @Column({ unsigned: true })
    data!: number;
}

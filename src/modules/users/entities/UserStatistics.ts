import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/users/entities/User';

@Entity({ name: 'user_statistics' })
export class UserStatistics {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @Column({ default: 0 })
    cityCount!: number;

    @Column({ default: 0 })
    mountainCount!: number;

    @Column({ default: 0 })
    seaCount!: number;

    @JoinColumn()
    @OneToOne(() => User, (user) => user.statistics, { onDelete: 'CASCADE' })
    user!: User;
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/users/entities/User';

@Entity({ name: 'badges' })
export class Badge {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @Column({ unique: true, nullable: false })
    name!: string;

    @ManyToOne(() => User, (user) => user.badges, { onDelete: 'CASCADE' })
    user!: User;
}

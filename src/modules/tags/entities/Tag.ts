import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tags' })
export class Tag {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @Column({ unique: true, nullable: false })
    name!: string;
}

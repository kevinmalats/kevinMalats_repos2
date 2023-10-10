// tasks/task.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: false })
    isCompleted: boolean;
}

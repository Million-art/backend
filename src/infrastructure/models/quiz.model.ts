import { QuestionType, Difficulty } from '../../domain/interfaces/enums';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('quizzes')
export class QuizModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  duration: number; // in minutes

  @Column({ type: 'int', default: 0 })
  totalQuestions: number;

  @Column({ type: 'int', default: 0 })
  passingScore: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  questions: any[]; // Store questions as JSON

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'enum', enum: Difficulty, default: Difficulty.EASY })
  difficulty: Difficulty;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

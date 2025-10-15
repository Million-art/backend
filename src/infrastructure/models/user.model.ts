import { Roles } from '../../domain/interfaces/enums';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string; // Added for authentication

  @Column({ nullable: true })
  passwordExpiresAt: Date; // Password expiry timestamp

  @Column({ default: false })
  isTemporaryPassword: boolean; // Flag for temporary passwords

  @Column({ nullable: true })
  inviteToken: string; // Invite token for password setting

  @Column({ nullable: true })
  tokenExpiresAt: Date; // Token expiry timestamp

  @Column({ enum: Roles })
  role: Roles;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

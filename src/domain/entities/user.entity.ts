import { UserInterface } from '../interfaces/user.interface';
import { Roles } from '../interfaces/enums';

export class UserEntity implements UserInterface {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly password?: string; // Added for authentication
  public readonly passwordExpiresAt?: Date; // Password expiry timestamp
  public readonly isTemporaryPassword?: boolean; // Flag for temporary passwords
  public readonly inviteToken?: string; // Invite token for password setting
  public readonly tokenExpiresAt?: Date; // Token expiry timestamp
  public readonly role: Roles;
  public readonly isActive: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    role: Roles,
    isActive: boolean = true,
    password?: string,
    passwordExpiresAt?: Date,
    isTemporaryPassword?: boolean,
    inviteToken?: string,
    tokenExpiresAt?: Date,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.isActive = isActive;
    this.password = password;
    this.passwordExpiresAt = passwordExpiresAt;
    this.isTemporaryPassword = isTemporaryPassword;
    this.inviteToken = inviteToken;
    this.tokenExpiresAt = tokenExpiresAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validate();
  }

  private validate(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('User Id is required');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('User name is required');
    }
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Incorrect Email');
    }
    if (!this.role) {
      throw new Error('User role is required');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public static create(
    name: string,
    email: string,
    role = Roles.ADMIN,
  ): UserEntity {
    const id = crypto.randomUUID();
    return new UserEntity(id, name, email, role); // isActive defaults to true
  }

  public updateProfile(name: string, email?: string): UserEntity {
    return new UserEntity(
      this.id,
      name,
      email || this.email,
      this.role,
      this.isActive,
      this.password,
      this.passwordExpiresAt,
      this.isTemporaryPassword,
      this.inviteToken,
      this.tokenExpiresAt,
      this.createdAt,
      this.updatedAt,
    );
  }

  public changeRole(newRole: Roles): UserEntity {
    if (this.role === Roles.SUPERADMIN) {
      throw new Error('SuperAdmin role cannot be changed');
    }
    return new UserEntity(
      this.id,
      this.name,
      this.email,
      newRole,
      this.isActive,
      this.password,
      this.passwordExpiresAt,
      this.isTemporaryPassword,
      this.inviteToken,
      this.tokenExpiresAt,
      this.createdAt,
      this.updatedAt,
    );
  }

  public deactivateUser(): UserEntity {
    if (!this.isActive) {
      throw new Error('User is already deactivated');
    }
    return new UserEntity(
      this.id, 
      this.name, 
      this.email, 
      this.role, 
      false,
      this.password,
      this.passwordExpiresAt,
      this.isTemporaryPassword,
      this.inviteToken,
      this.tokenExpiresAt,
      this.createdAt,
      this.updatedAt,
    );
  }

  public activateUser(): UserEntity {
    if (this.isActive) {
      throw new Error('User is already activated');
    }
    return new UserEntity(
      this.id, 
      this.name, 
      this.email, 
      this.role, 
      true,
      this.password,
      this.passwordExpiresAt,
      this.isTemporaryPassword,
      this.inviteToken,
      this.tokenExpiresAt,
      this.createdAt,
      this.updatedAt,
    );
  }

  public setPassword(password: string, isTemporary: boolean = false): UserEntity {
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // Set expiry date for temporary passwords (24 hours from now)
    const passwordExpiresAt = isTemporary ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined;
    
    return new UserEntity(
      this.id, 
      this.name, 
      this.email, 
      this.role, 
      this.isActive, 
      password,
      passwordExpiresAt,
      isTemporary,
      this.inviteToken,
      this.tokenExpiresAt,
      this.createdAt,
      this.updatedAt,
    );
  }

  public isPasswordExpired(): boolean {
    if (!this.passwordExpiresAt) {
      return false; // No expiry set, password is permanent
    }
    return new Date() > this.passwordExpiresAt;
  }

  public hasTemporaryPassword(): boolean {
    return this.isTemporaryPassword === true;
  }

  public setInviteToken(expiryHours: number = 24): UserEntity {
    const token = this.generateSecureToken();
    const tokenExpiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);
    
    return new UserEntity(
      this.id,
      this.name,
      this.email,
      this.role,
      this.isActive,
      this.password,
      this.passwordExpiresAt,
      this.isTemporaryPassword,
      token,
      tokenExpiresAt,
      this.createdAt,
      this.updatedAt,
    );
  }

  public clearInviteToken(): UserEntity {
    return new UserEntity(
      this.id,
      this.name,
      this.email,
      this.role,
      this.isActive,
      this.password,
      this.passwordExpiresAt,
      this.isTemporaryPassword,
      undefined,
      undefined,
      this.createdAt,
      this.updatedAt,
    );
  }

  public isTokenValid(): boolean {
    if (!this.inviteToken || !this.tokenExpiresAt) {
      return false;
    }
    return new Date() < this.tokenExpiresAt;
  }

  private generateSecureToken(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }
}

import { Roles } from './enums';

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  password?: string; // Added for authentication
  passwordExpiresAt?: Date; // Password expiry timestamp
  isTemporaryPassword?: boolean; // Flag for temporary passwords
  inviteToken?: string; // Invite token for password setting
  tokenExpiresAt?: Date; // Token expiry timestamp
  role: Roles;
  isActive: boolean;
}

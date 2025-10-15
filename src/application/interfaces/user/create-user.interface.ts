import { Roles } from '../../../domain/interfaces/enums';

export interface CreateUserRequest {
  name: string;
  email: string;
  role: Roles;
}

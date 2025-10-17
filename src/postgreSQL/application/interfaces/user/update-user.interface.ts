import { Roles } from '../../../domain/interfaces/enums';

export interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  role?: Roles;
}

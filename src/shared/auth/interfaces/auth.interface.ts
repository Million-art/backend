import { Roles } from '../../../postgreSQL/domain/interfaces/enums/user.enum';

export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: Roles;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Roles;
  iat?: number;
  exp?: number;
}

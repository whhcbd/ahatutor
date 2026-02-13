export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserResponse;
}

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  role: UserRole;
}

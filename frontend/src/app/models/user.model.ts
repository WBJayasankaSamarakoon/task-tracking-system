export type UserRole = 'Project Manager' | 'Developer' | 'QA Engineer' | 'Admin';

export const USER_ROLES: UserRole[] = [
  'Project Manager',
  'Developer',
  'QA Engineer',
  'Admin'
];

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

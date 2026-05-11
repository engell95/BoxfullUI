export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  company?: {
    id: string;
    name: string;
  };
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  whatsapp?: string;
  gender?: string;
  dateOfBirth?: string;
}

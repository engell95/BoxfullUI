export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  company?: {
    id: string;
    name: string;
  };
}

export interface LoginCredentials {
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

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  appToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
}

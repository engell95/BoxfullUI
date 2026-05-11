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

export interface AuthCredentials {
  email: string;
  password?: string; 
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
}

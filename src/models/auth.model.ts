export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user';
  avatar?: string;
}

export interface AuthCredentials {
  email: string;
  password?: string; // Opcional porque no siempre lo devolvemos
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
}

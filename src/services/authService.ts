import api from '@/lib/axios';
import { LoginDto, RegisterDto, AuthResponse } from '@/types/auth';

const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
const APP_SECRET = process.env.NEXT_PUBLIC_APP_SECRET;

export const authService = {
  /**
   * Genera el token de aplicación necesario para registrarse o iniciar sesión
   */
  async getAppToken(): Promise<string> {
    const response = await api.post('auth/app-login', {
      appId: APP_ID,
      appSecret: APP_SECRET,
    });
    return response.data.access_token;
  },

  /**
   * Inicia sesión de usuario
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    // 1. Obtener App Token
    const appToken = await this.getAppToken();
    
    // 2. Llamar a login con el App Token en los headers
    const response = await api.post('auth/login', data, {
      headers: {
        Authorization: `Bearer ${appToken}`,
      },
    });
    
    return response.data;
  },

  /**
   * Registra un nuevo usuario
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    // 1. Obtener App Token
    const appToken = await this.getAppToken();
    
    // 2. Llamar a register con el App Token en los headers
    const response = await api.post('auth/register', data, {
      headers: {
        Authorization: `Bearer ${appToken}`,
      },
    });
    
    return response.data;
  },

  /**
   * Refresca los tokens de usuario
   */
  async refreshToken(token: string): Promise<{ access_token: string; refresh_token: string }> {
    const response = await api.post('auth/refresh', { refreshToken: token });
    return response.data;
  },
};

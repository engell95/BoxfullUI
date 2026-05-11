import api from '@/lib/axios';
import axios from 'axios';
import { LoginCredentials, RegisterDto, AuthResponse, User } from '@/models/auth.model';

const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
const APP_SECRET = process.env.NEXT_PUBLIC_APP_SECRET;

export const authService = {
  /**
   * Login a nivel de aplicación (obtiene token base)
   */
  async appLogin(): Promise<string> {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL?.endsWith('/') 
        ? process.env.NEXT_PUBLIC_API_URL 
        : `${process.env.NEXT_PUBLIC_API_URL}/`;
        
      const response = await axios.post(`${baseURL}auth/app-login`, {
        appId: APP_ID,
        appSecret: APP_SECRET,
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error in app login:', error);
      throw error;
    }
  },

  /**
   * Iniciar sesión de usuario
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    try {
      // 1. Siempre obtenemos un App Token fresco primero
      const appToken = await this.appLogin();
      
      // 2. Realizamos el login enviando el App Token en los headers
      const response = await api.post('/auth/login', credentials, {
        headers: {
          Authorization: `Bearer ${appToken}`
        }
      });

      return {
        user: response.data.user,
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token
      };
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  },

  /**
   * Registra un nuevo usuario
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    try {
      // 1. Obtener App Token
      const appToken = await this.appLogin();
      
      // 2. Llamar a register con el App Token en los headers
      const response = await api.post('auth/register', data, {
        headers: {
          Authorization: `Bearer ${appToken}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error in register:', error);
      throw error;
    }
  },

  /**
   * Refrescar tokens (Usuario o App)
   */
  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  },
};

import axios from 'axios';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';

const baseURL = process.env.NEXT_PUBLIC_API_URL?.endsWith('/') 
  ? process.env.NEXT_PUBLIC_API_URL 
  : `${process.env.NEXT_PUBLIC_API_URL}/`;

const api = axios.create({
  baseURL,
});

// Interceptor de Peticiones: Adjuntar el mejor token disponible
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const userToken = localStorage.getItem('accessToken');
    const appToken = localStorage.getItem('appToken');
    const token = userToken || appToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor de Respuestas: Manejo de Expiración y Refresco
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const isUserSession = !!localStorage.getItem('accessToken');

        if (isUserSession && refreshToken) {
          // Intentar refrescar sesión de usuario
          const response = await axios.post(`${baseURL}auth/refresh`, {
            refreshToken,
          });
          
          const { access_token, refresh_token } = response.data;
          localStorage.setItem('accessToken', access_token);
          localStorage.setItem('refreshToken', refresh_token);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } else {
          // Si no hay sesión de usuario o falló, intentar refrescar App Token
          const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
          const APP_SECRET = process.env.NEXT_PUBLIC_APP_SECRET;
          
          const appResponse = await axios.post(`${baseURL}auth/app-login`, {
            appId: APP_ID,
            appSecret: APP_SECRET,
          });
          
          const { access_token } = appResponse.data;
          localStorage.setItem('appToken', access_token);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Critical Auth Error: Refresh failed', refreshError);
        
        // Solo sacamos al login si realmente falló el refresco de una sesión de usuario
        const isUserSession = !!localStorage.getItem('accessToken');
        if (isUserSession) {
          store.dispatch(logout());
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

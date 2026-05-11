import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '@/models/auth.model';

const getInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      user: null, accessToken: null, refreshToken: null, appToken: null,
      isAuthenticated: false, loading: false, error: null, success: null,
    };
  }

  const userStr = localStorage.getItem('user');
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const appToken = localStorage.getItem('appToken');

  // Si tenemos el token de acceso, consideramos que está autenticado inicialmente
  const isAuthenticated = !!accessToken;

  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing persisted user');
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    appToken,
    isAuthenticated,
    loading: false,
    error: null,
    success: null,
  };
};

const initialState: AuthState = getInitialState();


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    setAppToken: (state, action: PayloadAction<string>) => {
      state.appToken = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('appToken', action.payload);
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.success = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },
  },
});

export const { setCredentials, setAppToken, logout, setLoading, setError, setSuccess } = authSlice.actions;
export default authSlice.reducer;

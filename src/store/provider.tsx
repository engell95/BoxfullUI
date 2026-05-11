'use client';

import { Provider, useDispatch } from 'react-redux';
import { store } from './index';
import React, { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { setAppToken, setCredentials } from './slices/authSlice';

function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      const existingAppToken = localStorage.getItem('appToken');
      if (!existingAppToken) {
        try {
          const token = await authService.appLogin();
          dispatch(setAppToken(token));
        } catch (error) {
          console.error('Failed to initialize app token');
        }
      }
      setReady(true);
    };

    initApp();
  }, [dispatch]);

  if (!ready) return null; // O un spinner de carga global

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppInitializer>
        {children}
      </AppInitializer>
    </Provider>
  );
}

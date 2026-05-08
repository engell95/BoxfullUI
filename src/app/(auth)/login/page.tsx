'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { setCredentials, setLoading } from '@/store/slices/authSlice';
import api from '@/lib/axios';

const { Title, Text } = Typography;

// Schema de validación con Yup
const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('El email es requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('La contraseña es requerida'),
});

type FormData = yup.InferType<typeof schema>;

export default function LoginPage() {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    dispatch(setLoading(true));
    try {
      // Aquí conectamos con tu backend externo
      const response = await api.post('/auth/login', data);
      const { user, accessToken, refreshToken } = response.data;
      
      localStorage.setItem('refreshToken', refreshToken);
      dispatch(setCredentials({ user, accessToken }));
      
      message.success('Bienvenido de nuevo');
      // window.location.href = '/dashboard';
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>Iniciar Sesión</Title>
          <Text type="secondary">Ingresa tus credenciales para continuar</Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Correo Electrónico"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  prefix={<UserOutlined />} 
                  placeholder="ejemplo@correo.com" 
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password 
                  {...field} 
                  prefix={<LockOutlined />} 
                  placeholder="••••••••" 
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

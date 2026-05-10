'use client';

import React from 'react';
import { Form, Input, Button, Row, Col, Typography, Layout, Grid } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setCredentials, setLoading, setError } from '@/store/slices/authSlice';
import api from '@/lib/axios';
import { colors } from '@/config/theme';
import { loginSchema } from '@/validations/auth';
import { AuthSidebar } from '@/components/auth';

const { Title, Text } = Typography;
const { Content } = Layout;
const { useBreakpoint } = Grid;

type FormData = yup.InferType<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const screens = useBreakpoint();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    dispatch(setLoading(true));
    
    // Simulación de login
    setTimeout(() => {
      dispatch(setCredentials({ 
        user: { 
          id: '1', 
          name: 'Usuario Prueba', 
          email: data.email 
        }, 
        accessToken: 'mock-jwt-token' 
      }));

      dispatch(setLoading(false));
      router.push('/overview');
    }, 1500);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Content>
        <Row style={{ minHeight: '100vh' }}>

          <Col xs={24} md={10} lg={10} xl={10} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            padding: screens.md ? '40px' : '0 10%', 
            margin: screens.md ? 0 : '40px 0'
          }}>

            <div style={{ marginBottom: 40 }}>
              <img src="/general/logo.webp" alt="Boxful" style={{ width: 144, marginBottom: 40 }} />
              <Title level={2} style={{ fontWeight: 800, marginBottom: 8, fontSize: 24 }}>Bienvenido</Title>
              <Text style={{ fontSize: 14, color: colors.black,height:'auto' }}>Por favor ingresa tus credenciales</Text>
            </div>

            <Form layout="vertical" onFinish={handleSubmit(onSubmit)} size="middle">
              <Form.Item 
              label={<Text strong style={{ fontSize: 12, color: colors.black }}>Correo Electrónico</Text>}
               validateStatus={errors.email ? 'error' : ''} 
               help={errors.email?.message}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder="tu@correo.com" style={{ borderRadius: 8, border: '1px solid #EDEDED', height: 40 }} />}
                />
              </Form.Item>

              <Form.Item label={<Text strong style={{ fontSize: 12, color: colors.black }}>Contraseña</Text>} validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input.Password 
                      {...field} 
                      placeholder="••••••••" 
                      style={{ borderRadius: 8, border: '1px solid #EDEDED', height: 40 }} 
                    />
                  )}
                />
                <div style={{ textAlign: 'right', marginTop: 12 }}>
                  <Link href="#" style={{ fontSize: 12, color: colors.textSecondary }}>¿Olvidaste tu contraseña?</Link>
                </div>
              </Form.Item>

              <Form.Item style={{ marginTop: 40 }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  style={{ 
                    height: 45, 
                    background: colors.secondary, 
                    borderColor: colors.secondary, 
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: 'none'
                  }}
                >
                  Iniciar Sesión
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Text style={{ color: '#4b5563', fontSize: 13 }}>¿Necesitas una cuenta? </Text>
                <Link href="/register" style={{ fontWeight: 700, color: '#161734', textDecoration: 'none', fontSize: 13 }}>Regístrate aquí</Link>
              </div>
            </Form>
          </Col>

          <AuthSidebar />
        </Row>
      </Content>
    </Layout>
  );
}

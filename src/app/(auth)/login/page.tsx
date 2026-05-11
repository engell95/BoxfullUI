'use client';

import React from 'react';
import { Form, Row, Col, Typography, Layout, Grid } from 'antd';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setCredentials, setLoading, setError } from '@/store/slices/authSlice';
import { colors } from '@/config/theme';
import { loginSchema } from '@/validations/auth';
import { authService } from '@/services/authService';
import { AuthSidebar } from '@/components/auth';
import { getErrorMessage } from '@/utils/error-handler';
import { BoxfulField } from '@/components/ui/BoxfulField';
import BoxfulHeader from '@/components/ui/BoxfulHeader';
import BoxfulButton from '@/components/ui/BoxfulButton';

const { Text } = Typography;
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
    dispatch(setError(null));
    
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });

      dispatch(setCredentials({ 
        user: response.user, 
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      }));

      router.push('/overview');
    } catch (error: any) {
      const message = getErrorMessage(error);
      dispatch(setError(message));
      console.error('Login error:', error);
    } finally {
      dispatch(setLoading(false));
    }
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
              <BoxfulHeader 
                title="Bienvenido" 
                subtitle="Por favor ingresa tus credenciales"
                marginBottom={0}
              />
            </div>

            <Form layout="vertical" onFinish={() => handleSubmit(onSubmit)()} size="middle">
              <BoxfulField
                name="email"
                control={control}
                label="Correo Electrónico"
                placeholder="tu@correo.com"
                error={errors.email?.message}
              />

              <BoxfulField
                name="password"
                control={control}
                label="Contraseña"
                placeholder="••••••••"
                type="password"
                error={errors.password?.message}
              />
              <div style={{ textAlign: 'right', marginTop: -10 }}>
                <Link href="#" style={{ fontSize: 12, color: colors.textSecondary }}>¿Olvidaste tu contraseña?</Link>
              </div>

              <Form.Item style={{ marginTop: 40 }}>
                <BoxfulButton 
                  variant="secondary"
                  htmlType="submit"
                >
                  Iniciar Sesión
                </BoxfulButton>
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

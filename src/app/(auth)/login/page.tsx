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
import { colors } from '@/styles/theme';
import { loginSchema } from '@/validations/auth';

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
    
    // Simulación de login para la prueba técnica
    setTimeout(() => {
      dispatch(setCredentials({ 
        user: { name: 'Usuario Prueba', email: data.email }, 
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
          {/* Columna Izquierda: Formulario */}
          <Col xs={24} md={10} lg={10} xl={10} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            padding: screens.md ? '0 2%' : '0 10%', // Padding responsivo
            margin: screens.md ? 0 : '40px 0' // Espacio extra en móvil
          }}>

            <div style={{ marginBottom: 40 }}>
              <Title level={2} style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: colors.textBase }}>Bienvenido</Title>
              <Text style={{ fontSize: 16, color: colors.textSecondary }}>Por favor ingresa tus credenciales</Text>
            </div>

            <Form layout="vertical" onFinish={handleSubmit(onSubmit)} size="large">
              <Form.Item
                label={<Text style={{ color: colors.textBase, fontSize: 13, fontWeight: 500 }}>Correo Electrónico</Text>}
                validateStatus={errors.email ? 'error' : ''}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Digita tu correo" style={{ borderRadius: 8, padding: '12px' }} />
                  )}
                />
              </Form.Item>

              <Form.Item
                label={<Text style={{ color: colors.textBase, fontSize: 13, fontWeight: 500 }}>Contraseña</Text>}
                validateStatus={errors.password ? 'error' : ''}
                help={errors.password?.message}
                style={{ marginBottom: 8 }}
              >
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input.Password {...field} placeholder="Digita el NIT del comercio" style={{ borderRadius: 8, padding: '12px' }} />
                  )}
                />
              </Form.Item>

              <div style={{ textAlign: 'right', marginBottom: 30,marginTop: 30 }}>
                <Link href="#" style={{ fontSize: 12, color: colors.textBase }}>¿Olvidaste tu contraseña?</Link>
              </div>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  style={{ 
                    height: 50, 
                    background: colors.backgroundPattern, 
                    borderColor: colors.backgroundPattern, 
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600
                  }}
                >
                  Iniciar Sesión
                </Button>
              </Form.Item>

                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <Text style={{ color: colors.textSecondary }}>¿Necesitas una cuenta? </Text>
                  <Link href="/register" style={{ fontWeight: 'bold', color: colors.textSecondary, textDecoration: 'none' }}>Regístrate aquí</Link>
                </div>
            </Form>
          </Col>

          {/* Columna Derecha: Imagen y Patrón */}
          <Col xs={0} md={14} lg={10} xl={14} style={{ position: 'relative', overflow: 'hidden',backgroundColor: colors.background }}>
           
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

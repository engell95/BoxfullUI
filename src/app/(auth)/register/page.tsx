'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Typography, Layout, Grid, Select, Modal } from 'antd';
import { ArrowLeftOutlined, WarningFilled } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { registerSchema } from '@/validations/auth';
import { authService } from '@/services/authService';
import { AuthSidebar } from '@/components/auth';
import { getErrorMessage } from '@/utils/error-handler';
import { setLoading, setError, setSuccess } from '@/store/slices/authSlice';

const { Title, Text } = Typography;
const { Content } = Layout;
const { useBreakpoint } = Grid;
const { Option } = Select;

type FormData = yup.InferType<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const screens = useBreakpoint();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempData, setTempData] = useState<FormData | null>(null);
  const [countryCode, setCountryCode] = useState('503');
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      whatsapp: '',
    }
  });

  const onSubmit = (data: FormData) => {
    setTempData(data);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!tempData) return;
    
    // Cerrar el modal de confirmación y activar carga global
    setIsModalOpen(false);
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(setSuccess(null));
    
    try {
      const response = await authService.register({
        firstName: tempData.firstName,
        lastName: tempData.lastName,
        email: tempData.email,
        password: tempData.password,
        whatsapp: `${countryCode}${tempData.whatsapp}`,
        gender: tempData.gender || 'OTHER',
        dateOfBirth: tempData.dateOfBirth,
      });

      dispatch(setSuccess('Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.'));
      router.push('/login');
    } catch (error: any) {
      const message = getErrorMessage(error);
      console.error('Registration error:', error);
      dispatch(setError(message));
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
            justifyContent: 'flex-start', 
            padding: screens.md ? '40px' : '20px 5%', 
            height: '100vh', 
            overflowY: 'auto',
            backgroundColor: '#fff'
          }}>
            <div style={{ marginBottom: 32 }}>
              <img src="/general/logo.webp" alt="Boxful" style={{ height: 40, marginBottom: 24 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Link href="/login" style={{ color: '#000', fontSize: 24, display: 'flex', alignItems: 'center' }}>
                  <ArrowLeftOutlined />
                </Link>
                <Title level={2} style={{ fontWeight: 800, margin: 0 }}>Cuéntanos de ti</Title>
              </div>
            </div>

            <Form layout="vertical" onFinish={() => handleSubmit(onSubmit)()} size="large">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={<Text strong style={{ fontSize: 12 }}>Nombre</Text>} validateStatus={errors.firstName ? 'error' : ''} help={errors.firstName?.message}>
                    <Controller name="firstName" control={control} render={({ field }) => <Input {...field} placeholder="Paco" style={{ borderRadius: 8 }} />} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<Text strong style={{ fontSize: 12 }}>Apellido</Text>} validateStatus={errors.lastName ? 'error' : ''} help={errors.lastName?.message}>
                    <Controller name="lastName" control={control} render={({ field }) => <Input {...field} placeholder="Heras" style={{ borderRadius: 8 }} />} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label={<Text strong style={{ fontSize: 12 }}>Correo Electrónico</Text>} validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
                <Controller name="email" control={control} render={({ field }) => <Input {...field} placeholder="pacoheras@boxful.com" style={{ borderRadius: 8 }} />} />
              </Form.Item>

              <Form.Item label={<Text strong style={{ fontSize: 12 }}>Número de Whatsapp</Text>} validateStatus={errors.whatsapp ? 'error' : ''} help={errors.whatsapp?.message}>
                <Controller
                  name="whatsapp"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      {...field} 
                      placeholder="7777 7777" 
                      style={{ borderRadius: 8 }}
                      addonBefore={
                        <Select value={countryCode} onChange={setCountryCode} style={{ width: 90 }}>
                          <Option value="505">+505</Option>
                          <Option value="503">+503</Option>
                          <Option value="502">+502</Option>
                        </Select>
                      }
                    />
                  )}
                />
              </Form.Item>

              <Form.Item label={<Text strong style={{ fontSize: 12 }}>Contraseña</Text>} validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
                <Controller name="password" control={control} render={({ field }) => <Input.Password {...field} placeholder="••••••••" style={{ borderRadius: 8 }} />} />
              </Form.Item>

              <Form.Item label={<Text strong style={{ fontSize: 12 }}>Repite tu contraseña</Text>} validateStatus={errors.confirmPassword ? 'error' : ''} help={errors.confirmPassword?.message}>
                <Controller name="confirmPassword" control={control} render={({ field }) => <Input.Password {...field} placeholder="••••••••" style={{ borderRadius: 8 }} />} />
              </Form.Item>

              <Form.Item style={{ marginTop: 40 }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  style={{ 
                    height: 50, 
                    background: '#1a1a2e', 
                    borderColor: '#1a1a2e', 
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600
                  }}
                >
                  Siguiente
                </Button>
              </Form.Item>
            </Form>
          </Col>

          {/* Columna Derecha: Imagen y Patrón */}
          <AuthSidebar />
        </Row>
      </Content>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        closable
        width={450}
        styles={{
          body: { padding: '32px 24px' }
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            background: '#FFF7ED', 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <WarningFilled style={{ fontSize: 40, color: '#F97316' }} />
          </div>
          
          <Title level={4} style={{ marginBottom: 12, fontWeight: 700 }}>
            Confirmar número <span style={{ fontWeight: 800 }}>de teléfono</span>
          </Title>
          
          <Text style={{ fontSize: 15, color: '#4B5563', display: 'block', marginBottom: 32 }}>
            ¿Está seguro de que desea continuar con el número <Text strong>+{countryCode} {tempData?.whatsapp}?</Text>
          </Text>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button 
              onClick={() => setIsModalOpen(false)}
              style={{ 
                height: 44, 
                borderRadius: 8, 
                padding: '0 24px',
                fontWeight: 600,
                color: '#374151'
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="primary" 
              onClick={handleConfirm}
              style={{ 
                height: 44, 
                borderRadius: 8, 
                background: '#2563EB', 
                borderColor: '#2563EB',
                padding: '0 32px',
                fontWeight: 600
              }}
            >
              Aceptar
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

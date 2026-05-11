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
import { BoxfulField } from '@/components/ui/BoxfulField';
import BoxfulHeader from '@/components/ui/BoxfulHeader';
import BoxfulButton from '@/components/ui/BoxfulButton';

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
                <BoxfulHeader 
                  title="Cuéntanos de ti" 
                  subtitle="Completa la información de registro"
                  marginBottom={0} 
                />
              </div>
            </div>

            <Form layout="vertical" onFinish={() => handleSubmit(onSubmit)()} size="large">
              <Row gutter={16}>
                <Col span={12}>
                  <BoxfulField
                    name="firstName"
                    control={control}
                    label="Nombre"
                    placeholder="Digita tu nombre"
                    error={errors.firstName?.message}
                  />
                </Col>
                <Col span={12}>
                  <BoxfulField
                    name="lastName"
                    control={control}
                    label="Apellido"
                    placeholder="Digita tu apellido"
                    error={errors.lastName?.message}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <BoxfulField
                    name="gender"
                    control={control}
                    label="Sexo"
                    type="select"
                    placeholder="Seleccionar"
                    options={[
                      { label: 'Masculino', value: 'MALE' },
                      { label: 'Femenino', value: 'FEMALE' },
                      { label: 'Otro', value: 'OTHER' },
                    ]}
                    error={errors.gender?.message}
                  />
                </Col>
                <Col span={12}>
                  <BoxfulField
                    name="dateOfBirth"
                    control={control}
                    label="Fecha de nacimiento"
                    type="date"
                    placeholder="Seleccionar"
                    error={errors.dateOfBirth?.message}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <BoxfulField
                    name="email"
                    control={control}
                    label="Correo electrónico"
                    placeholder="Digitar correo"
                    error={errors.email?.message}
                  />
                </Col>
                <Col span={12}>
                  <BoxfulField
                    name="whatsapp"
                    control={control}
                    label="Número de whatsapp"
                    placeholder="7777 7777"
                    error={errors.whatsapp?.message}
                    addonBefore={
                      <Select value={countryCode} onChange={setCountryCode} style={{ width: 90 }}>
                        <Option value="503">503</Option>
                        <Option value="505">505</Option>
                        <Option value="502">502</Option>
                      </Select>
                    }
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <BoxfulField
                    name="password"
                    control={control}
                    label="Contraseña"
                    placeholder="Digitar contraseña"
                    type="password"
                    error={errors.password?.message}
                  />
                </Col>
                <Col span={12}>
                  <BoxfulField
                    name="confirmPassword"
                    control={control}
                    label="Repetir contraseña"
                    placeholder="Digitar contraseña"
                    type="password"
                    error={errors.confirmPassword?.message}
                  />
                </Col>
              </Row>

              <Form.Item style={{ marginTop: 40 }}>
                <BoxfulButton 
                  htmlType="submit" 
                  size="large"
                >
                  Siguiente
                </BoxfulButton>
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
            <BoxfulButton 
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              fullWidth={false}
              style={{ padding: '0 24px' }}
            >
              Cancelar
            </BoxfulButton>
            <BoxfulButton 
              variant="secondary" 
              onClick={handleConfirm}
              fullWidth={false}
              style={{ padding: '0 32px' }}
            >
              Aceptar
            </BoxfulButton>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

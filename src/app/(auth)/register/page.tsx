'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Typography, Layout, Grid, Select, Modal } from 'antd';
import { ArrowLeftOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { registerSchema } from '@/validations/auth';
import { AuthSidebar } from '@/components/auth';

const { Title, Text } = Typography;
const { Content } = Layout;
const { useBreakpoint } = Grid;
const { Option } = Select;

type FormData = yup.InferType<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
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

  const handleConfirm = () => {
    setIsModalOpen(false);
    router.push('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Content>
        <Row style={{ minHeight: '100vh' }}>
          {/* Lado Izquierdo: Formulario */}
          <Col xs={24} md={10} lg={10} xl={10} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            padding: screens.xs ? '40px 20px' : '0 8%' 
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

            <Form layout="vertical" onFinish={handleSubmit(onSubmit)} size="large">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={<Text strong style={{ fontSize: 12 }}>Nombre</Text>} validateStatus={errors.nombre ? 'error' : ''} help={errors.nombre?.message}>
                    <Controller name="nombre" control={control} render={({ field }) => <Input {...field} placeholder="Paco" style={{ borderRadius: 8 }} />} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<Text strong style={{ fontSize: 12 }}>Apellido</Text>} validateStatus={errors.apellido ? 'error' : ''} help={errors.apellido?.message}>
                    <Controller name="apellido" control={control} render={({ field }) => <Input {...field} placeholder="Heras" style={{ borderRadius: 8 }} />} />
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
                          <Option value="503">+503</Option>
                          <Option value="505">+505</Option>
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

      {/* Modal de Confirmación */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={400}
        bodyStyle={{ padding: '40px 24px', textAlign: 'center' }}
      >
        <CheckCircleFilled style={{ fontSize: 60, color: '#166534', marginBottom: 24 }} />
        <Title level={3}>¡Casi listo!</Title>
        <Text style={{ fontSize: 16, color: '#4b5563', display: 'block', marginBottom: 32 }}>
          Te enviaremos un código de confirmación a tu Whatsapp <Text strong>{countryCode} {tempData?.whatsapp}</Text>
        </Text>
        <Button 
          type="primary" 
          block 
          onClick={handleConfirm}
          style={{ height: 48, borderRadius: 8, background: '#1a1a2e', borderColor: '#1a1a2e' }}
        >
          Confirmar y registrarme
        </Button>
      </Modal>
    </Layout>
  );
}

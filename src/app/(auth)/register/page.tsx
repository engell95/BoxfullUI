'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Typography, Layout, Grid, Select, DatePicker, Modal } from 'antd';
import { ArrowLeftOutlined, WarningFilled } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { colors } from '@/styles/theme';

const { Title, Text } = Typography;
const { Content } = Layout;
const { useBreakpoint } = Grid;
const { Option } = Select;
import { registerSchema } from '@/validations/auth';

type FormData = yup.InferType<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const screens = useBreakpoint();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempData, setTempData] = useState<FormData | null>(null);
  const [countryCode, setCountryCode] = useState('505');
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      whatsapp: '',
    }
  });

  const whatsappValue = watch('whatsapp');

  const onSubmit = (data: FormData) => {
    setTempData(data);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    console.log('Final Data:', tempData);
    setIsModalOpen(false);
    // Aquí iría el api.post('/auth/register', tempData);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Content>
        <Row style={{ minHeight: '100vh' }}>
          {/* Lado Izquierdo: Formulario */}
          <Col xs={24} md={12} lg={12} xl={12} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            padding: screens.md ? '0 5%' : '0 10%',
            margin: screens.md ? 0 : '40px 0'
          }}>
            <div style={{ width: '100%' }}>
              {/* Header con flecha atrás */}
              <Link href="/login" style={{ display: 'flex', alignItems: 'center', marginBottom: 8, textDecoration: 'none', color: 'inherit' }}>
                <ArrowLeftOutlined style={{ marginRight: 12, fontSize: 18 }} />
                <Title level={2} style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Cuéntanos de ti</Title>
              </Link>
              <Text style={{ fontSize: 16, color: colors.textSecondary, marginBottom: 32, display: 'block' }}>
                Completa la información de registro
              </Text>

              <Form layout="vertical" onFinish={handleSubmit(onSubmit)} size="large">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Nombre" validateStatus={errors.nombre ? 'error' : ''} help={errors.nombre?.message}>
                      <Controller
                        name="nombre"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Digita tu nombre" />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Apellido" validateStatus={errors.apellido ? 'error' : ''} help={errors.apellido?.message}>
                      <Controller
                        name="apellido"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Digita tu apellido" />}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Sexo" validateStatus={errors.sexo ? 'error' : ''} help={errors.sexo?.message}>
                      <Controller
                        name="sexo"
                        control={control}
                        render={({ field }) => (
                          <Select {...field} placeholder="Seleccionar">
                            <Option value="masculino">Masculino</Option>
                            <Option value="femenino">Femenino</Option>
                          </Select>
                        )}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Fecha de nacimiento" validateStatus={errors.fechaNacimiento ? 'error' : ''} help={errors.fechaNacimiento?.message}>
                      <Controller
                        name="fechaNacimiento"
                        control={control}
                        render={({ field }) => (
                          <DatePicker {...field} placeholder="Seleccionar" style={{ width: '100%' }} />
                        )}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Correo electrónico" validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Digitar correo" />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Número de whatsapp" validateStatus={errors.whatsapp ? 'error' : ''} help={errors.whatsapp?.message}>
                      <Controller
                        name="whatsapp"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            {...field} 
                            placeholder="7777 7777" 
                            addonBefore={
                              <Select value={countryCode} onChange={setCountryCode} style={{ width: 80 }}>
                                <Option value="505">505</Option>
                                <Option value="503">503</Option>
                                <Option value="502">502</Option>
                                <Option value="504">504</Option>
                              </Select>
                            }
                          />
                        )}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Contraseña" validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => <Input.Password {...field} placeholder="Digitar contraseña" />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Repetir contraseña" validateStatus={errors.confirmPassword ? 'error' : ''} help={errors.confirmPassword?.message}>
                      <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => <Input.Password {...field} placeholder="Digitar contraseña" />}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item style={{ marginTop: 24 }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    style={{ 
                      height: 50, 
                      background: colors.backgroundPattern, 
                      borderColor: colors.backgroundPattern,
                      fontSize: 16,
                      fontWeight: 600
                    }}
                  >
                    Siguiente
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>

          {/* Lado Derecho: Espacio (Igual que login) */}
          <Col xs={0} md={12} lg={12} xl={12} style={{ background: colors.background }} />
        </Row>
      </Content>

      {/* Modal de Confirmación de Teléfono */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        closable
        width={450}
        bodyStyle={{ padding: '40px 24px', textAlign: 'center' }}
      >
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
          <WarningFilled style={{ fontSize: 40, color: '#FDBA74' }} />
        </div>

        <Title level={3} style={{ marginBottom: 12 }}>
          Confirmar número <span style={{ fontWeight: 800 }}>de teléfono</span>
        </Title>
        
        <Text style={{ fontSize: 16, color: '#4b5563', display: 'block', marginBottom: 32 }}>
          ¿Está seguro de que desea continuar con el número <span style={{ fontWeight: 700 }}>+{countryCode} {whatsappValue}</span>?
        </Text>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button 
            onClick={() => setIsModalOpen(false)} 
            style={{ height: 48, borderRadius: 8, flex: 1, fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button 
            type="primary" 
            onClick={handleConfirm}
            style={{ 
              height: 48, 
              borderRadius: 8, 
              flex: 1, 
              fontWeight: 600, 
              background: colors.backgroundPattern, 
              borderColor: colors.backgroundPattern 
            }}
          >
            Aceptar
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}

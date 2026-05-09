'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Typography, Card, DatePicker, Select, Space, Divider } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined, PlusOutlined, DeleteOutlined, BoxPlotOutlined } from '@ant-design/icons';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { colors } from '@/styles/theme';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Schema para el paso 1
const step1Schema = yup.object().shape({
  direccionRecoleccion: yup.string().required('Campo requerido'),
  fechaProgramada: yup.date().required('Campo requerido'),
  nombres: yup.string().required('Campo requerido'),
  apellidos: yup.string().required('Campo requerido'),
  email: yup.string().email('Inválido').required('Campo requerido'),
  telefono: yup.string().required('Campo requerido'),
  direccionDestinatario: yup.string().required('Campo requerido'),
  departamento: yup.string().required('Campo requerido'),
  municipio: yup.string().required('Campo requerido'),
  puntoReferencia: yup.string().required('Campo requerido'),
  indicaciones: yup.string(),
});

// Schema para el paso 2
const step2Schema = yup.object().shape({
  productos: yup.array().of(
    yup.object().shape({
      largo: yup.string().required(),
      alto: yup.string().required(),
      ancho: yup.string().required(),
      peso: yup.string().required(),
      contenido: yup.string().required(),
    })
  ).min(1, 'Agrega al menos un producto'),
});

export default function CreateOrderPage() {
  const [step, setStep] = useState(1);
  
  const form1 = useForm({
    resolver: yupResolver(step1Schema),
  });

  const form2 = useForm({
    resolver: yupResolver(step2Schema),
    defaultValues: {
      productos: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form2.control,
    name: "productos"
  });

  // Estado local para el producto que se está escribiendo actualmente
  const [currentProduct, setCurrentProduct] = useState({
    largo: '15', alto: '15', ancho: '15', peso: '3 libras', contenido: 'iPhone 14 pro Max'
  });

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const onFinalSubmit = (data: any) => {
    console.log('Orden Completa:', { ...form1.getValues(), ...data });
  };

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ fontWeight: 800, color: colors.secondary, marginBottom: 8 }}>Crea una orden</Title>
        <Text style={{ fontSize: 16, color: '#4b5563' }}>
          Dale una ventaja competitiva a tu negocio con entregas <Text strong>el mismo día</Text> (Área Metropolitana) y <Text strong>el día siguiente</Text> a nivel nacional.
        </Text>
      </div>

      <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderRadius: 12 }}>
        {step === 1 ? (
          <>
            <Title level={4} style={{ marginBottom: 32, fontWeight: 700 }}>Completa los datos</Title>
            <Form layout="vertical" onFinish={form1.handleSubmit(handleNext)} size="large">
              <Row gutter={24}>
                <Col span={16}>
                  <Form.Item label="Dirección de recolección">
                    <Controller name="direccionRecoleccion" control={form1.control} render={({ field }) => <Input {...field} placeholder="Colonia Las Magnolias, calle militar 1, San Salvador" />} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Fecha programada">
                    <Controller name="fechaProgramada" control={form1.control} render={({ field }) => <DatePicker {...field} style={{ width: '100%' }} />} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item label="Nombres" validateStatus={form1.formState.errors.nombres ? 'error' : ''} help={form1.formState.errors.nombres?.message}>
                    <Controller name="nombres" control={form1.control} render={({ field }) => <Input {...field} placeholder="Gabriela Reneé" />} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Apellidos" validateStatus={form1.formState.errors.apellidos ? 'error' : ''} help={form1.formState.errors.apellidos?.message}>
                    <Controller name="apellidos" control={form1.control} render={({ field }) => <Input {...field} placeholder="Días López" />} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Correo electrónico" validateStatus={form1.formState.errors.email ? 'error' : ''} help={form1.formState.errors.email?.message}>
                    <Controller name="email" control={form1.control} render={({ field }) => <Input {...field} placeholder="gabbydiaz@gmail.com" />} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item label="Teléfono" validateStatus={form1.formState.errors.telefono ? 'error' : ''} help={form1.formState.errors.telefono?.message}>
                    <Controller
                      name="telefono"
                      control={form1.control}
                      render={({ field }) => (
                        <Input 
                          {...field} 
                          placeholder="7777 7777" 
                          addonBefore={
                            <Select defaultValue="503" style={{ width: 80 }}>
                              <Option value="503">503</Option>
                            </Select>
                          }
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item label="Dirección del destinatario" validateStatus={form1.formState.errors.direccionDestinatario ? 'error' : ''} help={form1.formState.errors.direccionDestinatario?.message}>
                    <Controller name="direccionDestinatario" control={form1.control} render={({ field }) => <Input {...field} placeholder="Final 49 Av. Sur y Bulevar Los Próceres, Smartcenter, Bodega #8, San Salvador" />} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item label="Departamento" validateStatus={form1.formState.errors.departamento ? 'error' : ''} help={form1.formState.errors.departamento?.message}>
                    <Controller name="departamento" control={form1.control} render={({ field }) => <Input {...field} placeholder="San Salvador" />} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Municipio" validateStatus={form1.formState.errors.municipio ? 'error' : ''} help={form1.formState.errors.municipio?.message}>
                    <Controller name="municipio" control={form1.control} render={({ field }) => <Input {...field} placeholder="San Salvador" />} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Punto de referencia" validateStatus={form1.formState.errors.puntoReferencia ? 'error' : ''} help={form1.formState.errors.puntoReferencia?.message}>
                    <Controller name="puntoReferencia" control={form1.control} render={({ field }) => <Input {...field} placeholder="Cerca de redondel Arbol de la Paz" />} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item label="Indicaciones" validateStatus={form1.formState.errors.indicaciones ? 'error' : ''} help={form1.formState.errors.indicaciones?.message}>
                    <Controller name="indicaciones" control={form1.control} render={({ field }) => <TextArea {...field} rows={4} placeholder="Llamar antes de entregar" />} />
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                <Button type="primary" htmlType="submit" size="large" style={{ background: colors.backgroundPattern, borderRadius: 8, height: 48, padding: '0 40px' }}>
                  Siguiente <ArrowRightOutlined />
                </Button>
              </div>
            </Form>
          </>
        ) : (
          <>
            <Title level={4} style={{ marginBottom: 32, fontWeight: 700 }}>Agrega tus productos</Title>
            
            {/* Formulario de Entrada de Producto */}
            <div style={{ background: '#f9fafb', padding: 24, borderRadius: 12, marginBottom: 24 }}>
              <Row gutter={16} align="bottom">
                <Col span={6}>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Dimensiones (Largo x Alto x Ancho)</Text>
                  <Space>
                    <Input value={currentProduct.largo} onChange={e => setCurrentProduct({...currentProduct, largo: e.target.value})} suffix="cm" style={{ width: 70 }} />
                    <Input value={currentProduct.alto} onChange={e => setCurrentProduct({...currentProduct, alto: e.target.value})} suffix="cm" style={{ width: 70 }} />
                    <Input value={currentProduct.ancho} onChange={e => setCurrentProduct({...currentProduct, ancho: e.target.value})} suffix="cm" style={{ width: 70 }} />
                  </Space>
                </Col>
                <Col span={4}>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Peso en libras</Text>
                  <Input value={currentProduct.peso} onChange={e => setCurrentProduct({...currentProduct, peso: e.target.value})} />
                </Col>
                <Col span={10}>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Contenido</Text>
                  <Input value={currentProduct.contenido} onChange={e => setCurrentProduct({...currentProduct, contenido: e.target.value})} />
                </Col>
                <Col span={4}>
                  <Button 
                    block 
                    icon={<PlusOutlined />} 
                    onClick={() => {
                      append(currentProduct);
                      setCurrentProduct({ largo: '', alto: '', ancho: '', peso: '', contenido: '' });
                    }}
                    style={{ borderRadius: 8, height: 40 }}
                  >
                    Agregar
                  </Button>
                </Col>
              </Row>
            </div>

            {/* Lista de Productos Agregados */}
            <div style={{ marginBottom: 40 }}>
              {fields.map((field, index) => (
                <div key={field.id} style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: 12, 
                  padding: '16px 24px', 
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#fff'
                }}>
                  <Space size={40}>
                    <BoxPlotOutlined style={{ fontSize: 24, color: '#9ca3af' }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Peso en libras</Text>
                      <Text strong>{field.peso}</Text>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Contenido</Text>
                      <Text strong>{field.contenido}</Text>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Dimensiones</Text>
                      <Text strong>{field.largo}x{field.alto}x{field.ancho} cm</Text>
                    </div>
                  </Space>
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(index)} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <Button size="large" icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ borderRadius: 8 }}>
                Regresar
              </Button>
              <Button type="primary" size="large" style={{ background: colors.backgroundPattern, borderRadius: 8, padding: '0 40px' }} onClick={form2.handleSubmit(onFinalSubmit)}>
                Enviar <ArrowRightOutlined />
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

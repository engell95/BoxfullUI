'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Typography, Card, DatePicker, Select, Space, Divider, Modal } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined, PlusOutlined, DeleteOutlined, BoxPlotOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { colors } from '@/config/theme';

import { orderStep1Schema, orderStep2Schema } from '@/validations/order';
import { orderService } from '@/services/orderService';
import { locationService, LocationItem } from '@/services/locationService';
import { useDispatch } from 'react-redux';
import { setLoading, setError } from '@/store/slices/authSlice';
import { getErrorMessage } from '@/utils/error-handler';
import { BoxfulField } from '@/components/ui/BoxfulField';
import BoxfulButton from '@/components/ui/BoxfulButton';
import { Switch } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function CreateOrderPage() {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  const [departments, setDepartments] = useState<LocationItem[]>([]);
  const [municipalities, setMunicipalities] = useState<LocationItem[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const form1 = useForm({
    resolver: yupResolver(orderStep1Schema),
    defaultValues: {
      direccionRecoleccion: '',
      fechaProgramada: undefined,
      nombres: '',
      apellidos: '',
      email: '',
      telefono: '',
      direccionDestinatario: '',
      departamento: '',
      municipio: '',
      puntoReferencia: '',
      indicaciones: '',
      isCOD: false,
      expectedAmount: 0
    }
  });

  const selectedDeptName = form1.watch('departamento');

  // Cargar departamentos al inicio
  React.useEffect(() => {
    const fetchDeps = async () => {
      try {
        const deps = await locationService.getDepartments();
        setDepartments(deps);
      } catch (error) {
        console.error('Error loading departments');
      }
    };
    fetchDeps();
  }, []);

  // Efecto para reaccionar al cambio de departamento
  React.useEffect(() => {
    if (selectedDeptName) {
      const dept = departments.find(d => d.name === selectedDeptName || d.id === selectedDeptName);
      if (dept) {
        handleDepartmentChange(dept.id);
      }
    }
  }, [selectedDeptName, departments]);

  // Cargar municipios cuando cambia el departamento
  const handleDepartmentChange = async (deptId: string) => {
    setLoadingLocations(true);
    form1.setValue('municipio', ''); // Limpiar municipio previo
    try {
      const munis = await locationService.getMunicipalities(deptId);
      setMunicipalities(munis);
    } catch (error) {
      console.error('Error loading municipalities');
    } finally {
      setLoadingLocations(false);
    }
  };

  const form2 = useForm({
    resolver: yupResolver(orderStep2Schema),
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

  const onFinalSubmit = async (data: any) => {
    const step1Data = form1.getValues();
    
    // Mapear al modelo exacto del backend
    const finalData = {
      pickupAddress: step1Data.direccionRecoleccion,
      deliveryDate: step1Data.fechaProgramada ? dayjs(step1Data.fechaProgramada).toISOString() : dayjs().toISOString(),
      recipientFirstName: step1Data.nombres,
      recipientLastName: step1Data.apellidos,
      recipientEmail: step1Data.email,
      recipientPhone: step1Data.telefono,
      recipientAddress: step1Data.direccionDestinatario,
      recipientMunicipality: step1Data.municipio,
      recipientDepartment: step1Data.departamento,
      instructions: step1Data.indicaciones,
      isCOD: step1Data.isCOD,
      expectedAmount: step1Data.isCOD ? Number(step1Data.expectedAmount) : 0,
      packages: data.productos.map((p: any) => ({
        content: p.contenido,
        weightInLbs: Number(p.peso.split(' ')[0]) || 0,
        width: Number(p.ancho),
        height: Number(p.alto),
        length: Number(p.largo),
      }))
    };

    dispatch(setLoading(true));
    try {
      await orderService.createOrder(finalData);
      setIsSuccessModalOpen(true);
    } catch (error) {
      dispatch(setError(getErrorMessage(error)));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const resetAll = () => {
    form1.reset({
      direccionRecoleccion: '',
      fechaProgramada: undefined,
      nombres: '',
      apellidos: '',
      email: '',
      telefono: '',
      direccionDestinatario: '',
      departamento: '',
      municipio: '',
      puntoReferencia: '',
      indicaciones: '',
      isCOD: false,
      expectedAmount: 0
    });
    form2.reset({
      productos: []
    });
    setStep(1);
    setIsSuccessModalOpen(false);
  };

  return (
    <div>
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
                  <BoxfulField
                    name="direccionRecoleccion"
                    control={form1.control}
                    label="Dirección de recolección"
                    placeholder="Colonia Las Magnolias, calle militar 1, San Salvador"
                    error={form1.formState.errors.direccionRecoleccion?.message}
                  />
                </Col>
                <Col span={8}>
                  <BoxfulField
                    name="fechaProgramada"
                    control={form1.control}
                    label="Fecha programada"
                    type="date"
                    error={form1.formState.errors.fechaProgramada?.message}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={8}>
                  <BoxfulField
                    name="nombres"
                    control={form1.control}
                    label="Nombres"
                    placeholder="Gabriela Reneé"
                    error={form1.formState.errors.nombres?.message}
                  />
                </Col>
                <Col span={8}>
                  <BoxfulField
                    name="apellidos"
                    control={form1.control}
                    label="Apellidos"
                    placeholder="Días López"
                    error={form1.formState.errors.apellidos?.message}
                  />
                </Col>
                <Col span={8}>
                  <BoxfulField
                    name="email"
                    control={form1.control}
                    label="Correo electrónico"
                    placeholder="gabbydiaz@gmail.com"
                    error={form1.formState.errors.email?.message}
                  />
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={8}>
                  <BoxfulField
                    name="telefono"
                    control={form1.control}
                    label="Teléfono"
                    placeholder="7777 7777"
                    error={form1.formState.errors.telefono?.message}
                    addonBefore={
                      <Select defaultValue="503" style={{ width: 80 }}>
                        <Option value="503">503</Option>
                      </Select>
                    }
                  />
                </Col>
                <Col span={16}>
                  <BoxfulField
                    name="direccionDestinatario"
                    control={form1.control}
                    label="Dirección del destinatario"
                    placeholder="Final 49 Av. Sur y Bulevar Los Próceres, Smartcenter, Bodega #8, San Salvador"
                    error={form1.formState.errors.direccionDestinatario?.message}
                  />
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={8}>
                  <BoxfulField
                    name="departamento"
                    control={form1.control}
                    label="Departamento"
                    type="select"
                    placeholder="Seleccionar"
                    options={departments.map(d => ({ label: d.name, value: d.name }))}
                    error={form1.formState.errors.departamento?.message}
                  />
                </Col>
                <Col span={8}>
                  <BoxfulField
                    name="municipio"
                    control={form1.control}
                    label="Municipio"
                    type="select"
                    placeholder="Seleccionar"
                    options={municipalities.map(m => ({ label: m.name, value: m.name }))}
                    error={form1.formState.errors.municipio?.message}
                  />
                </Col>
                <Col span={8}>
                  <BoxfulField
                    name="puntoReferencia"
                    control={form1.control}
                    label="Punto de referencia"
                    placeholder="Cerca de redondel Arbol de la Paz"
                    error={form1.formState.errors.puntoReferencia?.message}
                  />
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={24}>
                  <BoxfulField
                    name="indicaciones"
                    control={form1.control}
                    label="Indicaciones"
                    placeholder="Llamar antes de entregar"
                    error={form1.formState.errors.indicaciones?.message}
                  />
                </Col>
              </Row>

              {/* Sección Pago contra entrega (PCE) */}
              <div style={{ 
                background: '#FFF7ED', 
                padding: '24px', 
                borderRadius: 12, 
                marginTop: 32,
                border: '1px solid #FFEDD5'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text strong style={{ fontSize: 16 }}>Pago contra entrega (PCE)</Text>
                  <Controller
                    name="isCOD"
                    control={form1.control}
                    render={({ field }) => (
                      <Switch 
                        checked={field.value} 
                        onChange={(checked) => {
                          field.onChange(checked);
                          if (!checked) form1.setValue('expectedAmount', 0);
                        }} 
                      />
                    )}
                  />
                </div>
                
                <Row align="middle" gutter={12}>
                  <Col>
                    <Text type="secondary">Tu cliente paga el <Text strong>monto que indiques</Text> al momento de la entrega</Text>
                  </Col>
                  <Col>
                    <Controller
                      name="expectedAmount"
                      control={form1.control}
                      render={({ field }) => (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginRight: 8, color: '#6b7280' }}>$</span>
                          <Input 
                            {...field} 
                            placeholder="00.00" 
                            type="number"
                            disabled={!form1.watch('isCOD')}
                            style={{ 
                              width: 120, 
                              height: 44, 
                              borderRadius: 8,
                              textAlign: 'center'
                            }} 
                          />
                        </div>
                      )}
                    />
                  </Col>
                </Row>
                {form1.formState.errors.expectedAmount && (
                  <Text type="danger" style={{ display: 'block', marginTop: 8 }}>
                    {form1.formState.errors.expectedAmount.message}
                  </Text>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                <BoxfulButton variant="primary" htmlType="submit" size="large" fullWidth={false} style={{ padding: '0 40px' }}>
                  Siguiente <ArrowRightOutlined />
                </BoxfulButton>
              </div>
            </Form>
          </>
        ) : (
          <>
            <Title level={4} style={{ marginBottom: 32, fontWeight: 700 }}>Agrega tus productos</Title>
            
            {/* Formulario de Entrada de Producto */}
            <div style={{ background: '#f9fafb', padding: 24, borderRadius: 12, marginBottom: 24 }}>
              <Row gutter={16} align="bottom">
                <Col span={2}>
                  <div style={{ 
                    background: '#fff', 
                    width: 50, 
                    height: 50, 
                    borderRadius: 8, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px solid #e5e7eb'
                  }}>
                    <BoxPlotOutlined style={{ fontSize: 24, color: '#9ca3af' }} />
                  </div>
                </Col>
                <Col span={6}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8, textTransform: 'uppercase', fontWeight: 600 }}>Dimensiones (Largo x Alto x Ancho)</Text>
                  <Space>
                    <Input value={currentProduct.largo} onChange={e => setCurrentProduct({...currentProduct, largo: e.target.value})} suffix="cm" style={{ width: 70 }} />
                    <Input value={currentProduct.alto} onChange={e => setCurrentProduct({...currentProduct, alto: e.target.value})} suffix="cm" style={{ width: 70 }} />
                    <Input value={currentProduct.ancho} onChange={e => setCurrentProduct({...currentProduct, ancho: e.target.value})} suffix="cm" style={{ width: 70 }} />
                  </Space>
                </Col>
                <Col span={4}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8, textTransform: 'uppercase', fontWeight: 600 }}>Peso en libras</Text>
                  <Input value={currentProduct.peso} onChange={e => setCurrentProduct({...currentProduct, peso: e.target.value})} placeholder="3 libras" />
                </Col>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8, textTransform: 'uppercase', fontWeight: 600 }}>Contenido</Text>
                  <Input value={currentProduct.contenido} onChange={e => setCurrentProduct({...currentProduct, contenido: e.target.value})} placeholder="iPhone 14 pro Max" />
                </Col>
                <Col span={4}>
                  <Button 
                    block 
                    type="primary"
                    ghost
                    icon={<PlusOutlined />} 
                    onClick={() => {
                      if(currentProduct.contenido && currentProduct.peso) {
                        append(currentProduct);
                        setCurrentProduct({ largo: '15', alto: '15', ancho: '15', peso: '', contenido: '' });
                      }
                    }}
                    style={{ borderRadius: 8, height: 40, border: '1px solid #e5e7eb', color: '#000' }}
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
                  border: '1px solid #D9F99D', // Borde verde claro como en la imagen
                  borderRadius: 12, 
                  padding: '16px 24px', 
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  background: '#fff',
                  justifyContent: 'space-between'
                }}>
                  <Row align="middle" style={{ width: '100%' }} gutter={16}>
                    <Col span={4}>
                      <Text type="secondary" style={{ fontSize: 11, display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Peso en libras</Text>
                      <Text strong style={{ fontSize: 14 }}>{field.peso}</Text>
                    </Col>
                    
                    <Col span={8}>
                      <Text type="secondary" style={{ fontSize: 11, display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Contenido</Text>
                      <Text strong style={{ fontSize: 14 }}>{field.contenido}</Text>
                    </Col>

                    <Col span={2} style={{ textAlign: 'center' }}>
                      <div style={{ background: '#F3F4F6', padding: 8, borderRadius: 8, display: 'inline-flex' }}>
                        <BoxPlotOutlined style={{ fontSize: 20, color: '#9ca3af' }} />
                      </div>
                    </Col>

                    <Col span={8}>
                      <Row gutter={12}>
                        <Col span={8}>
                          <Text type="secondary" style={{ fontSize: 11, display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Largo</Text>
                          <Text strong style={{ fontSize: 14 }}>{field.largo} <Text type="secondary" style={{ fontSize: 11 }}>cm</Text></Text>
                        </Col>
                        <Col span={8}>
                          <Text type="secondary" style={{ fontSize: 11, display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Alto</Text>
                          <Text strong style={{ fontSize: 14 }}>{field.alto} <Text type="secondary" style={{ fontSize: 11 }}>cm</Text></Text>
                        </Col>
                        <Col span={8}>
                          <Text type="secondary" style={{ fontSize: 11, display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Ancho</Text>
                          <Text strong style={{ fontSize: 14 }}>{field.ancho} <Text type="secondary" style={{ fontSize: 11 }}>cm</Text></Text>
                        </Col>
                      </Row>
                    </Col>

                    <Col span={2} style={{ textAlign: 'right' }}>
                      <Button 
                        type="primary" 
                        danger 
                        ghost 
                        icon={<DeleteOutlined />} 
                        onClick={() => remove(index)} 
                        style={{ border: 'none', background: '#FEE2E2', borderRadius: 8 }}
                      />
                    </Col>
                  </Row>
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

      {/* Modal de Éxito */}
      <Modal
        open={isSuccessModalOpen}
        onCancel={() => setIsSuccessModalOpen(false)}
        footer={null}
        centered
        closable
        width={400}
        bodyStyle={{ padding: '40px 24px', textAlign: 'center' }}
      >
        <div style={{ 
          background: '#F0FDF4', 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <CheckCircleFilled style={{ fontSize: 40, color: '#166534' }} />
        </div>

        <Title level={3} style={{ marginBottom: 12 }}>
          Orden <span style={{ fontWeight: 800 }}>enviada</span>
        </Title>
        
        <Text style={{ fontSize: 16, color: '#4b5563', display: 'block', marginBottom: 32 }}>
          La orden ha sido creada y enviada, puedes
        </Text>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button 
            onClick={() => {
              setIsSuccessModalOpen(false);
              setStep(1);
              form1.reset();
              form2.reset();
            }} 
            style={{ height: 48, borderRadius: 8, flex: 1, fontWeight: 600 }}
          >
            Ir a inicio
          </Button>
          <Button 
            type="primary" 
            onClick={resetAll}
            style={{ 
              height: 48, 
              borderRadius: 8, 
              flex: 1, 
              fontWeight: 600, 
              background: colors.backgroundPattern, 
              borderColor: colors.backgroundPattern 
            }}
          >
            Crear otra
          </Button>
        </div>
      </Modal>
    </div>
  );
}

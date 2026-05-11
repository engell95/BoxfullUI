'use client';

import React from 'react';
import { Modal, Spin, Typography, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setError, setSuccess } from '@/store/slices/authSlice';
import { LoadingOutlined, CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { colors } from '@/config/theme';

const { Text, Title } = Typography;

export default function GlobalFeedback() {
  const { loading, error, success } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleCloseError = () => {
    dispatch(setError(null));
  };

  const handleCloseSuccess = () => {
    dispatch(setSuccess(null));
  };

  return (
    <>
      {/* Modal de Carga */}
      <Modal
        open={loading}
        footer={null}
        closable={false}
        centered
        width={250}
        styles={{
          body: {
            padding: '40px 24px',
            textAlign: 'center',
          },
        }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: colors.primary }} spin />} />
        <div style={{ marginTop: 24 }}>
          <Text strong style={{ fontSize: 16 }}>Procesando...</Text>
          <br />
          <Text type="secondary">Por favor espera un momento</Text>
        </div>
      </Modal>

      {/* Modal de Error */}
      <Modal
        open={!!error}
        onCancel={handleCloseError}
        footer={null}
        centered
        closable
        width={400}
        styles={{
          body: {
            padding: '40px 24px',
            textAlign: 'center',
          },
        }}
      >
        <div style={{ 
          background: '#FEF2F2', 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <CloseCircleFilled style={{ fontSize: 40, color: '#EF4444' }} />
        </div>

        <Title level={3} style={{ marginBottom: 12 }}>
          Hubo un problema
        </Title>
        
        <Text style={{ fontSize: 16, color: '#4b5563', display: 'block', marginBottom: 32 }}>
          {error}
        </Text>

        <Button 
          type="primary" 
          onClick={handleCloseError}
          danger
          block
          style={{ height: 48, borderRadius: 8, fontWeight: 600 }}
        >
          Entendido
        </Button>
      </Modal>

      {/* Modal de Éxito */}
      <Modal
        open={!!success}
        onCancel={handleCloseSuccess}
        footer={null}
        centered
        closable
        width={400}
        styles={{
          body: {
            padding: '40px 24px',
            textAlign: 'center',
          },
        }}
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
          <CheckCircleFilled style={{ fontSize: 40, color: '#22C55E' }} />
        </div>

        <Title level={3} style={{ marginBottom: 12 }}>
          ¡Registro Exitoso!
        </Title>
        
        <Text style={{ fontSize: 16, color: '#4b5563', display: 'block', marginBottom: 32 }}>
          {success}
        </Text>

        <Button 
          type="primary" 
          onClick={handleCloseSuccess}
          block
          style={{ height: 48, borderRadius: 8, fontWeight: 600, background: '#22C55E', borderColor: '#22C55E' }}
        >
          Ir al Login
        </Button>
      </Modal>
    </>
  );
}

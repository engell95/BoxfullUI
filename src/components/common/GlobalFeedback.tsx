'use client';

import React from 'react';
import { Modal, Spin, Typography, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setError } from '@/store/slices/authSlice';
import { LoadingOutlined, CloseCircleFilled } from '@ant-design/icons';
import { colors } from '@/styles/theme';

const { Text, Title } = Typography;

export default function GlobalFeedback() {
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleCloseError = () => {
    dispatch(setError(null));
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
        bodyStyle={{ textAlign: 'center', padding: '40px 20px' }}
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
        bodyStyle={{ padding: '40px 24px', textAlign: 'center' }}
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
    </>
  );
}

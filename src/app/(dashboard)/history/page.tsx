'use client';

import React from 'react';
import { Table, Typography, Button, Input, Space, DatePicker, Row, Col, Tag, Card } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { colors } from '@/config/theme';
import { orderService } from '@/services/orderService';
import { Order } from '@/models/order.model';
import { getErrorMessage } from '@/utils/error-handler';
import { message } from 'antd';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface OrderData {
  key: string;
  orderNo: string;
  nombre: string;
  apellidos: string;
  departamento: string;
  municipio: string;
  paquetes: number;
}

const columns = [
  {
    title: 'No. de orden',
    dataIndex: 'orderNo',
    key: 'orderNo',
    render: (text: string) => <Text strong>{text}</Text>,
  },
  {
    title: 'Nombre',
    dataIndex: 'nombre',
    key: 'nombre',
  },
  {
    title: 'Apellidos',
    dataIndex: 'apellidos',
    key: 'apellidos',
  },
  {
    title: 'Departamento',
    dataIndex: 'departamento',
    key: 'departamento',
  },
  {
    title: 'Municipio',
    dataIndex: 'municipio',
    key: 'municipio',
  },
  {
    title: 'Paquetes en orden',
    dataIndex: 'paquetes',
    key: 'paquetes',
    render: (count: number) => (
      <div style={{ textAlign: 'center' }}>
        <Tag color="#F0FDF4" style={{ color: '#166534', border: '1px solid #BBF7D0', borderRadius: 4, padding: '0 8px' }}>
          {count}
        </Tag>
      </div>
    ),
  },
];

export default function HistoryPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleDownloadCSV = async () => {
    try {
      const ids = selectedRowKeys.map(key => key.toString());
      const blob = await orderService.exportOrders(ids);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ordenes_boxful_${new Date().getTime()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      message.error('Error al exportar las órdenes');
    }
  };

  // Mapear órdenes del API al formato de la tabla
  const dataSource = orders.map(order => ({
    key: order.id || '',
    orderNo: order.orderNo || 'N/A',
    nombre: order.recipientFirstName,
    apellidos: order.recipientLastName,
    departamento: order.recipientDepartment,
    municipio: order.recipientMunicipality,
    paquetes: order.packages.length,
  }));

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ fontWeight: 800, color: colors.secondary, marginBottom: 8 }}>Mis envíos</Title>
      </div>

      <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderRadius: 12 }}>
        <Row gutter={16} style={{ marginBottom: 24 }} align="middle">
          <Col>
            <RangePicker 
              placeholder={['Enero', 'Julio']} 
              style={{ height: 40, borderRadius: 8 }}
            />
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              style={{ background: colors.backgroundPattern, borderColor: colors.backgroundPattern, height: 40, borderRadius: 8, padding: '0 24px' }}
            >
              Buscar
            </Button>
          </Col>
          <Col>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleDownloadCSV}
              style={{ height: 40, borderRadius: 8, padding: '0 24px' }}
            >
              Descargar órdenes
            </Button>
          </Col>
        </Row>

        <Table 
          rowSelection={{ 
            type: 'checkbox',
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          columns={columns} 
          dataSource={dataSource} 
          loading={loading}
          pagination={{ pageSize: 10 }}
          style={{ background: '#fff' }}
          rowClassName={() => 'history-table-row'}
        />
      </Card>

      <style jsx global>{`
        .ant-table-thead > tr > th {
          background: #f9fafb !important;
          color: #6b7280 !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          text-transform: uppercase !important;
        }
        .history-table-row {
          height: 64px;
        }
      `}</style>
    </div>
  );
}

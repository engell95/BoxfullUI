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

const columns = [
  {
    title: 'No. de orden',
    dataIndex: 'orderNo',
    key: 'orderNo',
    render: (text: string, record: Order) => <Text strong>{record.id?.slice(-6).toUpperCase() || 'N/A'}</Text>,
  },
  {
    title: 'Nombre',
    dataIndex: 'recipientFirstName',
    key: 'recipientFirstName',
  },
  {
    title: 'Apellidos',
    dataIndex: 'recipientLastName',
    key: 'recipientLastName',
  },
  {
    title: 'Departamento',
    dataIndex: 'recipientDepartment',
    key: 'recipientDepartment',
  },
  {
    title: 'Municipio',
    dataIndex: 'recipientMunicipality',
    key: 'recipientMunicipality',
  },
  {
    title: 'Paquetes',
    dataIndex: 'packages',
    key: 'packages',
    render: (packages: any[]) => (
      <Tag color="#F0FDF4" style={{ color: '#166534', border: '1px solid #BBF7D0', borderRadius: 4 }}>
        {packages?.length || 0}
      </Tag>
    ),
  },
  {
    title: 'Estado',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      let color = 'default';
      let label = status;
      
      switch (status) {
        case 'PENDING': color = 'orange'; label = 'Pendiente'; break;
        case 'SHIPPED': color = 'blue'; label = 'Enviado'; break;
        case 'DELIVERED': color = 'green'; label = 'Entregado'; break;
        case 'CANCELLED': color = 'red'; label = 'Cancelado'; break;
      }
      
      return <Tag color={color}>{label}</Tag>;
    }
  },
];

export default function HistoryPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [downloading, setDownloading] = React.useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [searchText, setSearchText] = React.useState('');
  const [dateRange, setDateRange] = React.useState<any>(null);

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const filters = {
        search: searchText,
        startDate: dateRange?.[0]?.toISOString(),
        endDate: dateRange?.[1]?.toISOString(),
      };
      const data = await orderService.getOrders(filters);
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
    setDownloading(true);
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
    } finally {
      setDownloading(false);
    }
  };


  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ fontWeight: 800, color: colors.secondary, marginBottom: 8 }}>Mis envíos</Title>
      </div>

      <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderRadius: 12 }}>
        <Row gutter={16} style={{ marginBottom: 24 }} align="middle">
          <Col span={6}>
            <Input 
              placeholder="Buscar por nombre, email o no. de orden" 
              prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={fetchOrders}
              style={{ height: 40, borderRadius: 8 }}
            />
          </Col>
          <Col>
            <RangePicker 
              placeholder={['Fecha inicio', 'Fecha fin']} 
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              style={{ height: 40, borderRadius: 8 }}
            />
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              onClick={fetchOrders}
              loading={loading}
              style={{ background: colors.backgroundPattern, borderColor: colors.backgroundPattern, height: 40, borderRadius: 8, padding: '0 24px' }}
            >
              Buscar
            </Button>
          </Col>
          <Col>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleDownloadCSV}
              loading={downloading}
              disabled={downloading}
              style={{ height: 40, borderRadius: 8, padding: '0 24px' }}
            >
              Descargar órdenes
            </Button>
          </Col>
        </Row>

        <Table 
          rowKey="id"
          rowSelection={{ 
            type: 'checkbox',
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          columns={columns} 
          dataSource={orders} 
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

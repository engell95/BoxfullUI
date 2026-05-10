'use client';

import React from 'react';
import { Table, Typography, Button, Input, Space, DatePicker, Row, Col, Tag, Card } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { colors } from '@/config/theme';

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

const data: OrderData[] = [
  {
    key: '1',
    orderNo: '3446788',
    nombre: 'Julio',
    apellidos: 'Almendarez',
    departamento: 'San Salvador',
    municipio: 'San Salvador',
    paquetes: 4,
  },
];

export default function HistoryPage() {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleDownloadCSV = () => {
    if (selectedRowKeys.length === 0) {
      alert('Por favor selecciona al menos una orden');
      return;
    }

    // Filtrar los datos seleccionados
    const selectedData = data.filter(item => selectedRowKeys.includes(item.key));

    // Convertir a CSV
    const headers = ['No. de orden', 'Nombre', 'Apellidos', 'Departamento', 'Municipio', 'Paquetes'];
    const csvContent = [
      headers.join(','), // Cabecera
      ...selectedData.map(item => [
        item.orderNo,
        item.nombre,
        item.apellidos,
        item.departamento,
        item.municipio,
        item.paquetes
      ].join(','))
    ].join('\n');

    // Crear el archivo y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ordenes_boxful_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: 1100 }}>
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
          dataSource={data} 
          pagination={false}
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

'use client';

import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Space } from 'antd';
import { PlusCircleOutlined, HistoryOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import Link from 'next/link';
import { colors } from '@/config/theme';
import GlobalFeedback from '@/components/common/GlobalFeedback';

const { Sider, Content, Header } = Layout;
const { Text, Title } = Typography;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [collapsed, setCollapsed] = useState(false);
  const [checking, setChecking] = useState(true);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setChecking(false);
    }
  }, [isAuthenticated, router]);

  if (checking) return null; // O un spinner de carga

  const menuItems = [
    {
      key: '/overview',
      icon: <PlusCircleOutlined />,
      label: 'Crear orden',
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: 'Historial',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar sesión',
      danger: true,
    },
  ];

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      dispatch(logout());
      router.push('/login');
    } else {
      router.push(key);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={260}
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ borderRight: '1px solid #f0f0f0' }}
      >
        <div style={{ padding: '24px 24px 40px' }}>
          <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/general/logo.webp" alt="Boxful" style={{ height: 32 }} />
            {!collapsed && <Title level={4} style={{ margin: 0, color: colors.secondary }}>boxful</Title>}
          </div>
          
          {!collapsed && <Text type="secondary" style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 16 }}>MENÚ</Text>}
          
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            style={{ borderRight: 0 }}
            items={menuItems.map(item => ({
              ...item,
              onClick: () => handleMenuClick(item.key),
              className: pathname === item.key ? 'active-menu-item' : ''
            }))}
          />
        </div>

        <style jsx global>{`
          .active-menu-item {
            background-color: ${colors.backgroundPattern} !important;
            color: white !important;
            border-radius: 8px !important;
          }
          .active-menu-item .ant-menu-item-icon {
            color: white !important;
          }
          .ant-menu-item {
            margin-bottom: 8px !important;
            height: 50px !important;
            line-height: 50px !important;
          }
        `}</style>
      </Sider>

      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 40px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
            {menuItems.find(i => i.key === pathname)?.label || 'Dashboard'}
          </Title>
          <Space>
            <Text strong>{'{Tunombre}'}</Text>
            <Avatar icon={<UserOutlined />} />
          </Space>
        </Header>

        <Content style={{ 
          background: '#f9fafb', 
          padding: '40px', 
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 64px)'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

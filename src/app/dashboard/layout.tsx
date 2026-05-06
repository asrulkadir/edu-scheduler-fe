'use client';
import NavComp from '@/components/Navigation';
import { Layout } from 'antd';
import UserContextProvider from '@/context/UserContext';
import HeaderDashboard from '@/components/HeaderDashboard';

const { Sider, Content } = Layout;

function DashboardLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <UserContextProvider>
      <Layout className="min-h-screen">
        <Sider
          width={220}
          style={{
            background: '#1a2e4a',
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'auto',
            flexShrink: 0,
          }}
        >
          <NavComp />
        </Sider>
        <Layout style={{ background: '#f5f7fa' }}>
          <HeaderDashboard />
          <Content className="min-h-screen p-6 md:p-8">{children}</Content>
        </Layout>
      </Layout>
    </UserContextProvider>
  );
}

export default DashboardLayout;

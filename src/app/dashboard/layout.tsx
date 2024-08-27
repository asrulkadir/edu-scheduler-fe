'use client';
import NavComp from '@/components/Navigation';
import { Layout } from 'antd';
import UserContextProvider from '@/context/UserContext';
import HeaderDashboard from '@/components/HeaderDashboard';

const { Sider, Content } = Layout;

function DashboardLayout({
  children, // will be a page or nested layout
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <UserContextProvider>
      <Layout>
        <Sider className="bg-primary-dark text-white">
          <NavComp />
        </Sider>
        <Layout>
          <HeaderDashboard />
          <Content className="flex min-h-screen flex-col p-8 bg-white">
            {children}
          </Content>
        </Layout>
      </Layout>
    </UserContextProvider>
  );
}

export default DashboardLayout;

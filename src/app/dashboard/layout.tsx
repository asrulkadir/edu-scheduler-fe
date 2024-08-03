'use client';
import NavComp from '@/components/Navigation';
import { colors } from '@/utils/colors';
import { usePathname } from 'next/navigation';
import { routes } from '@/utils/routes';
import { Layout } from 'antd';

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  readonly children: React.ReactNode
}) {
  const pathname = usePathname();

  return (
    <Layout>
      <Sider
        style={{ backgroundColor: colors.siderBgColor, color: colors.textColorDark }}
      >
        <NavComp />
      </Sider>
      <Layout>
        <Header
          style={{ backgroundColor: colors.headerBgColor, color: colors.textColorDark}}
          className='sticky top-0 left-0 w-full h-16 bg-white shadow-md flex items-center justify-between'
        >
          <h1 className='text-xl font-bold'>
            {
              routes.find((route) => route.href === pathname)?.name
            }
          </h1>
        </Header>
        <Content
          style={{ backgroundColor: colors.contentBgColor, color: colors.textColorDark }}
          className='flex min-h-screen flex-col p-4'
        >
          { children }
        </Content>
      </Layout>
    </Layout>
  );
}
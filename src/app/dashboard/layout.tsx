'use client';
import NavComp from '@/components/Navigation';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Layout, message } from 'antd';
import { useLogout } from '@/hooks/useAuth';
import { routes } from '@/libs/utils/routes';
import UserContextProvider from '@/context/UserContext';

const { Header, Sider, Content } = Layout;

function DashboardLayout({
  children, // will be a page or nested layout
}: {
  readonly children: React.ReactNode
}) {
  const pathname = usePathname();
  const { logout } = useLogout();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const onLogout = async () => {
    messageApi.open({
      type: 'loading',
      content: 'Logging out...',
      duration: 0,
    });
    await logout();
    router.push('/login');
  };

  return (
    <UserContextProvider>
      {contextHolder}
      <Layout>
        <Sider
          className='bg-primary-dark text-white'
        >
          <NavComp />
        </Sider>
        <Layout>
          <Header
            className='sticky top-0 left-0 w-full h-16 bg-secondary shadow-md flex items-center justify-between z-[99]'
          >
            <h1 className='text-xl font-bold'>
              {
                routes.find((route) => route.href === pathname)?.name
              }
            </h1>

            <Button onClick={onLogout}>
              Logout
            </Button>
          </Header>
          <Content
            className='flex min-h-screen flex-col p-8 bg-white'
          >
            { children }
          </Content>
        </Layout>
      </Layout>
    </UserContextProvider>
  );
}

export default DashboardLayout;
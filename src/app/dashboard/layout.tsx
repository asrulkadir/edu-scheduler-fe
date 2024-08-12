'use client';
import NavComp from '@/components/Navigation';
import { usePathname, useRouter } from 'next/navigation';
import { routes } from '@/libs/routes';
import { Button, Layout } from 'antd';
import { useLogout } from '@/hooks/useAuth';
import { useCurrentUser } from '@/hooks/useUser';

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  // const session = verifySession();
  // console.log('login session', session);
  const pathname = usePathname();
  const { logout } = useLogout();
  const { currentUser } = useCurrentUser();
  const router = useRouter();

  console.log('current user', currentUser);

  const onLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <Layout>
      <Sider
        className='bg-primary-dark text-white'
      >
        <NavComp />
      </Sider>
      <Layout>
        <Header
          className='sticky top-0 left-0 w-full h-16 bg-secondary shadow-md flex items-center justify-between'
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
          className='flex min-h-screen flex-col p-4 bg-gray-100'
        >
          { children }
        </Content>
      </Layout>
    </Layout>
  );
}
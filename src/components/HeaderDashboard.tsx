'use client';

import { UserContext } from '@/context/UserContext';
import { useLogout } from '@/hooks/useAuth';
import { routes } from '@/libs/utils/routes';
import { Button, Layout, message } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContext } from 'react';

const { Header } = Layout;

const HeaderDashboard = () => {
  const pathname = usePathname();
  const { logout } = useLogout();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { academic } = useContext(UserContext);

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
    <>
      {contextHolder}
      <Header className="sticky left-0 top-0 z-[99] flex h-16 w-full items-center justify-between bg-secondary shadow-md">
        <h1 className="text-xl font-bold">
          {routes.find((route) => route.href === pathname)?.name}
        </h1>

        {academic.id ? (
          <h1 className="text-lg font-bold">{academic?.name}</h1>
        ) : (
          <h1 className="text-lg font-bold">
            Tidak ada kalender akademik yang berjalan, ke halaman{' '}
            <Link
              href="/dashboard/academic-calendar"
              className="text-lg font-bold text-primary-light hover:underline"
            >
              kalender akademik
            </Link>
          </h1>
        )}

        <Button onClick={onLogout}>Logout</Button>
      </Header>
    </>
  );
};

export default HeaderDashboard;

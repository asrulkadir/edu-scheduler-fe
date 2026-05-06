'use client';

import { UserContext } from '@/context/UserContext';
import { useLogout } from '@/hooks/useAuth';
import { routes } from '@/libs/utils/routes';
import { Avatar, Button, Tag } from 'antd';
import { useMessage } from '@/hooks/useMessage';
import {
  LogoutOutlined,
  CalendarOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContext } from 'react';

const ROLE_COLOR: Record<string, string> = {
  ADMIN: 'blue',
  SUPERADMIN: 'purple',
  TEACHER: 'green',
  STUDENT: 'orange',
};

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Admin',
  SUPERADMIN: 'Super Admin',
  TEACHER: 'Guru',
  STUDENT: 'Siswa',
};

const HeaderDashboard = () => {
  const pathname = usePathname();
  const { logout } = useLogout();
  const router = useRouter();
  const messageApi = useMessage();
  const { academic, user } = useContext(UserContext);

  const onLogout = async () => {
    messageApi.open({
      type: 'loading',
      content: 'Logging out...',
    });
    await logout();
    router.push('/login');
  };

  const currentPageName = routes.find((route) => route.href === pathname)?.name;
  const initials = (user.name || user.username || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between gap-4 border-b border-gray-100 bg-white px-6 shadow-sm">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-bold text-gray-800">{currentPageName}</h1>
      </div>

      {/* Academic calendar badge */}
      <div className="flex items-center gap-2">
        {academic.id ? (
          <Tag
            icon={<CalendarOutlined />}
            color="blue"
            className="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium"
          >
            {academic.name}
          </Tag>
        ) : (
          <Tag
            icon={<WarningOutlined />}
            color="warning"
            className="flex items-center gap-1 rounded-full px-3 py-1 text-sm"
          >
            Tidak ada kalender aktif &mdash;{' '}
            <Link
              href="/dashboard/academic-calendar"
              className="font-semibold underline"
            >
              atur sekarang
            </Link>
          </Tag>
        )}
      </div>

      {/* Right: user + logout */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-gray-100"
        >
          <Avatar
            size={32}
            style={{
              backgroundColor: '#2B6DAA',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {initials}
          </Avatar>
          <div className="hidden flex-col sm:flex">
            <span className="text-xs leading-tight font-semibold text-gray-800">
              {user.name || user.username}
            </span>
            <Tag
              color={ROLE_COLOR[user.role] ?? 'default'}
              className="m-0! px-1.5! py-0! text-xs! leading-tight"
            >
              {ROLE_LABEL[user.role] ?? user.role}
            </Tag>
          </div>
        </Link>
        <Button
          icon={<LogoutOutlined />}
          onClick={onLogout}
          shape="circle"
          title="Logout"
          danger
        />
      </div>
    </header>
  );
};

export default HeaderDashboard;

'use client';

import { UserContext } from '@/context/UserContext';
import { routes } from '@/libs/utils/routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import {
  DashboardOutlined,
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  ScheduleOutlined,
  ReadOutlined,
  AppstoreOutlined,
  ProfileOutlined,
} from '@ant-design/icons';

const ROUTE_ICONS: Record<string, React.ReactNode> = {
  '/dashboard': <DashboardOutlined />,
  '/dashboard/teaching-schedule': <CalendarOutlined />,
  '/dashboard/subjects-schedule': <ScheduleOutlined />,
  '/dashboard/subjects': <BookOutlined />,
  '/dashboard/teacher': <ReadOutlined />,
  '/dashboard/class-page': <HomeOutlined />,
  '/dashboard/student': <TeamOutlined />,
  '/dashboard/academic-calendar': <AppstoreOutlined />,
  '/dashboard/user': <UserOutlined />,
  '/dashboard/profile': <ProfileOutlined />,
};

const Navigation = () => {
  const pathname = usePathname();
  const { user } = useContext(UserContext);

  return (
    <nav className="flex h-full flex-col">
      {/* Logo */}
      <div
        className="flex h-16 shrink-0 items-center justify-center gap-2"
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2B6DAA 100%)',
        }}
      >
        <span className="text-xl font-black tracking-widest text-white">
          SKEDULER
        </span>
      </div>

      {/* Menu */}
      <ul
        className="flex flex-1 flex-col gap-1 overflow-y-auto p-3"
        style={{ background: '#1a2e4a' }}
      >
        {routes
          .filter((route) => route.scope.read.includes(user.role))
          .map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link href={route.href} key={route.href}>
                <li
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white shadow-md'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-base transition-all ${
                      isActive ? 'bg-white text-blue-700' : 'text-white/60'
                    }`}
                  >
                    {ROUTE_ICONS[route.href] ?? <DashboardOutlined />}
                  </span>
                  <span className="truncate" title={route.name}>
                    {route.name}
                  </span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                  )}
                </li>
              </Link>
            );
          })}
      </ul>
    </nav>
  );
};

export default Navigation;

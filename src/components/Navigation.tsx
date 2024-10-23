'use client';

import { UserContext } from '@/context/UserContext';
import { routes } from '@/libs/utils/routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';

const Navigation = () => {
  const pathname = usePathname();
  const { user } = useContext(UserContext);

  return (
    <nav className="sticky left-0 top-0">
      <div className="sticky left-0 top-0 flex h-16 items-center justify-center bg-primary-dark shadow-md">
        Skeduler
      </div>
      <ul className="flex flex-col gap-2 p-4">
        {routes
          .filter((route) => route.scope.read.includes(user.role))
          .map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link href={route.href} key={route.href}>
                <li
                  className={`m-2 rounded-md p-2 font-bold ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'text-black hover:bg-gray-200'
                  }`}
                >
                  {route.name}
                </li>
              </Link>
            );
          })}
      </ul>
    </nav>
  );
};

export default Navigation;

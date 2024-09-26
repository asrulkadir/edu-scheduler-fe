'use client';

import { useLogout } from '@/hooks/useAuth';
import { getCookie } from '@/libs/utils/cookies';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const router = useRouter();
  const { logout } = useLogout();
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    setRole(getCookie('role'));
  }, []);

  const onReturnHome = async () => {
    await logout();
    router.push('/');
  };
  const onBack = () => {
    router.push(`/dashboard`);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <h2 className="mb-4 text-6xl font-bold text-red-600">404</h2>
      <p className="mb-8 text-xl text-gray-600">
        Oops! Halaman yang Anda cari tidak ditemukan.
      </p>
      <Button
        onClick={onReturnHome}
        className="rounded-md bg-primary-dark p-6 text-lg font-semibold text-white transition hover:bg-primary"
      >
        Kembali ke Halaman Utama
      </Button>
      {role && (
        <Button
          onClick={onBack}
          className="mt-5 rounded-md bg-primary-dark p-6 text-lg font-semibold text-white transition hover:bg-primary"
        >
          Kembali ke Dashboard
        </Button>
      )}
    </div>
  );
}

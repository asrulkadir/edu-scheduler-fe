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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-6xl font-bold text-red-600 mb-4">404</h2>
      <p className="text-xl text-gray-600 mb-8">
        Oops! Halaman yang Anda cari tidak ditemukan.
      </p>
      <Button
        onClick={onReturnHome}
        className="p-6 bg-primary-dark text-white rounded-md text-lg font-semibold hover:bg-primary transition"
      >
        Kembali ke Halaman Utama
      </Button>
      {role && (
        <Button
          onClick={onBack}
          className="p-6 bg-primary-dark text-white rounded-md text-lg font-semibold hover:bg-primary transition mt-5"
        >
          Kembali ke Dashboard
        </Button>
      )}
    </div>
  );
}

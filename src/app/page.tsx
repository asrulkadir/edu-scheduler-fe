'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button, Layout } from 'antd';
import { useRouter } from 'next/navigation';

const { Content } = Layout;

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/register');
  };
  return (
    <>
      <Header />
      <Content className="flex items-center justify-center bg-gray-100 p-12">
        <div className="w-full max-w-3xl space-y-6 rounded bg-white p-8 text-center shadow-md">
          <h1 className="text-4xl font-bold text-primary-light">
            Selamat Datang di School Scheduler
          </h1>
          <p className="text-lg text-gray-700">
            School Scheduler adalah aplikasi web yang dirancang untuk membantu
            sekolah mengelola dan mengatur jadwal pengajaran yang lebih efisien.
            Buat, kelola, dan bagikan jadwal dengan mudah kepada guru dan siswa.
            Jadikan proses penjadwalan lebih mudah dan komunikasi lebih baik di
            lembaga pendidikan Anda.
          </p>
          <Button type="primary" onClick={handleGetStarted}>
            Coba Sekarang
          </Button>
        </div>
      </Content>
      <Footer />
    </>
  );
}

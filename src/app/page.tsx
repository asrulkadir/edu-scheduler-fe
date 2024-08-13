'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Layout } from "antd";
import { useRouter } from "next/navigation";
import ButtonComp from "@/components/Button";

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
        <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl text-center space-y-6">
          <h1 className="text-4xl font-bold text-primary-light">
            Selamat Datang di School Scheduler
          </h1>
          <p className="text-gray-700 text-lg">
            School Scheduler adalah aplikasi web yang dirancang untuk membantu sekolah mengelola dan mengatur jadwal pengajaran yang lebih
            efisien. Buat, kelola, dan bagikan jadwal dengan mudah kepada guru dan siswa. Jadikan proses penjadwalan lebih mudah dan komunikasi lebih baik di lembaga pendidikan Anda.
          </p>
          <ButtonComp onClick={handleGetStarted} title="Coba Sekarang" />
        </div>
      </Content>
      <Footer />
    </>
  );
}

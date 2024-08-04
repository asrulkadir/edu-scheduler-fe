'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Layout, Menu, Typography, Card, Row, Col } from 'antd';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <>
      <Header />
      <Content className="p-12 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-md">
          <Title className="text-center text-primary-light">Tentang School Scheduler</Title>
          <Paragraph className="text-lg text-gray-700">
          School Scheduler adalah aplikasi web yang dirancang untuk membantu sekolah mengelola dan mengatur jadwal pengajaran secara efisien.
          Dengan platform kami, guru dan siswa dapat dengan mudah melihat, membuat, dan mengelola jadwal mereka, memastikan semua orang memiliki pemahaman yang sama.
          Misi kami adalah menyediakan antarmuka yang intuitif dan ramah pengguna yang menyederhanakan proses penjadwalan dan meningkatkan komunikasi dalam institusi pendidikan.
          </Paragraph>
          <Title level={2} className="mt-8 text-primary-light">Our Team</Title>
          <Row gutter={16} className="mt-4">
            <Col span={8}>
              <Card title="Your Name" bordered={false}>
                <p>Role: Founder & Developer</p>
                <p>Email: you@example.com</p>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Team Member 1" bordered={false}>
                <p>Role: Designer</p>
                <p>Email: team1@example.com</p>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Team Member 2" bordered={false}>
                <p>Role: Backend Developer</p>
                <p>Email: team2@example.com</p>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer />
    </>
  );
}

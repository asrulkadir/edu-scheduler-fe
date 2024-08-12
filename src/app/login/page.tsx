'use client';

import { useLogin } from "@/hooks/useAuth";
import { Button, Form, Input } from "antd";
import Link from 'next/link';
import { useRouter } from "next/navigation";

type FieldType = {
  username: string;
  password: string;
  remember?: string;
};

const LoginPage = () => {
  const { login, isMutating: loading, error } = useLogin();

  const router = useRouter();

  const onFinish = async (values: FieldType) => {
    const { username, password } = values;
    await login({ username, password });
    router.push('/dashboard');
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-primary-light to-primary-dark">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Login Page</h1>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
        {
          error && <p className="text-red-500 text-center">{error.message}</p>
        }
        <p className="text-center">
          Tidak punya akun? <Link href="/register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
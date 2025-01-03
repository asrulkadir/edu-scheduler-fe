'use client';

import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import Link from 'next/link';
import { TRegisterUserRequest } from '@/libs/types/user';
import Header from '@/components/Header';
import { useRegisterUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [form] = Form.useForm();
  const { registerUser, loadingRegisterUser } = useRegisterUser();
  const router = useRouter();

  const handleRegister = (values: TRegisterUserRequest) => {
    registerUser(values, {
      onSuccess: () => {
        router.push('/login');
      },
      onError: (error) => {
        message.error(error.message);
      },
    });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-primary-light to-primary-dark p-8">
        <div className="w-full max-w-md space-y-6 rounded bg-white p-8 shadow-md">
          <h1 className="text-center text-2xl font-bold">Register Page</h1>
          <Form form={form} layout="vertical" onFinish={handleRegister}>
            <Form.Item<TRegisterUserRequest>
              label="Nama Lembaga"
              name="clientName"
              rules={[
                {
                  required: true,
                  message: 'Please input your institution name!',
                },
              ]}
            >
              <Input placeholder="Masukkan Nama Lembaga" />
            </Form.Item>

            <Form.Item<TRegisterUserRequest>
              label="Nama"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input placeholder="Masukkan Nama" />
            </Form.Item>

            <Form.Item<TRegisterUserRequest>
              label="Username"
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input placeholder="Masukkan Username" />
            </Form.Item>

            <Form.Item<TRegisterUserRequest>
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                  type: 'email',
                },
              ]}
            >
              <Input placeholder="Masukkan Email" />
            </Form.Item>

            <Form.Item<TRegisterUserRequest>
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan Password"
                onClick={toggleShowPassword}
              />
            </Form.Item>

            <Form.Item<TRegisterUserRequest>
              label="Konfirmasi Password"
              name="confirmPassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        'The two passwords that you entered do not match!',
                      ),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Konfirmasi Password"
                onClick={toggleShowConfirmPassword}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loadingRegisterUser}
              >
                Register
              </Button>
            </Form.Item>
          </Form>
          <p className="text-center">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;

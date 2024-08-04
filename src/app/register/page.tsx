'use client';

import { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import Link from 'next/link';

const { Option } = Select;

const RegisterPage = () => {
  const [form] = Form.useForm();

  const handleRegister = (values: any) => {
    console.log('Success:', values);
    // Tambahkan logika register Anda di sini
  };

  const handleRegisterFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-primary-light to-primary-dark p-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Register Page</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegister}
          onFinishFailed={handleRegisterFailed}
        >
          <Form.Item
            label="Nama Lembaga"
            name="institutionName"
            rules={[{ required: true, message: 'Please input your institution name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nama"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Select placeholder="Select your role">
              <Option value="admin">Admin</Option>
              <Option value="guru">Guru</Option>
              <Option value="siswa">Siswa</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan Password"
              onClick={toggleShowPassword}
            />
          </Form.Item>

          <Form.Item
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
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmasi Password"
              onClick={toggleShowConfirmPassword}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Register
            </Button>
          </Form.Item>
        </Form>
        <p className="text-center">
          Sudah punya akun? <Link href="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
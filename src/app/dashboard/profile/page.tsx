'use client';

import { useContext, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Tag,
  Typography,
} from 'antd';
import { EditOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { UserContext } from '@/context/UserContext';
import { useUpdateUser } from '@/hooks/useUser';
import { useMessage } from '@/hooks/useMessage';
import { TUpdateUserRequest } from '@/libs/types/user';

const { Title, Text } = Typography;

const ROLE_LABEL: Record<string, { label: string; color: string }> = {
  ADMIN: { label: 'Admin', color: 'blue' },
  SUPERADMIN: { label: 'Super Admin', color: 'purple' },
  TEACHER: { label: 'Guru', color: 'green' },
  STUDENT: { label: 'Siswa', color: 'orange' },
};

const Page = () => {
  const { user } = useContext(UserContext);
  const message = useMessage();
  const { updateUser, loadingUpdateUser } = useUpdateUser();

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const roleInfo = ROLE_LABEL[user.role] ?? {
    label: user.role,
    color: 'default',
  };

  const onSaveProfile = (values: {
    name: string;
    email: string;
    username: string;
  }) => {
    const payload: TUpdateUserRequest = {
      id: user.id,
      name: values.name,
      email: values.email,
      username: values.username,
    };
    updateUser(payload, {
      onSuccess: (data) => {
        message.success(data.message ?? 'Profil berhasil diperbarui');
        setEditingProfile(false);
      },
      onError: (error) => {
        message.error(error.message ?? 'Gagal memperbarui profil');
      },
    });
  };

  const onSavePassword = (values: {
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Konfirmasi password tidak cocok');
      return;
    }
    const payload: TUpdateUserRequest = {
      id: user.id,
      password: values.password,
    };
    updateUser(payload, {
      onSuccess: (data) => {
        message.success(data.message ?? 'Password berhasil diperbarui');
        setEditingPassword(false);
        passwordForm.resetFields();
      },
      onError: (error) => {
        message.error(error.message ?? 'Gagal memperbarui password');
      },
    });
  };

  const handleCancelProfile = () => {
    setEditingProfile(false);
    profileForm.setFieldsValue({
      name: user.name,
      email: user.email,
      username: user.username,
    });
  };

  const handleEditProfile = () => {
    profileForm.setFieldsValue({
      name: user.name,
      email: user.email,
      username: user.username,
    });
    setEditingProfile(true);
  };

  return (
    <div>
      <Title level={2} className="mb-6!">
        Profil Saya
      </Title>

      <Row gutter={[24, 24]}>
        {/* Info Card */}
        <Col xs={24} lg={8}>
          <Card variant="borderless" className="text-center shadow-sm">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-4xl text-indigo-500">
                <UserOutlined />
              </div>
            </div>
            <Title level={4} className="mb-1!">
              {user.name}
            </Title>
            <Text type="secondary" className="mb-2 block">
              @{user.username}
            </Text>
            <Tag color={roleInfo.color}>{roleInfo.label}</Tag>
            <Divider />
            <div className="space-y-2 text-left">
              <div>
                <Text type="secondary" className="text-xs">
                  Email
                </Text>
                <div>
                  <Text>{user.email}</Text>
                </div>
              </div>
              <div>
                <Text type="secondary" className="text-xs">
                  Client ID
                </Text>
                <div>
                  <Text className="font-mono text-xs">{user.clientId}</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Edit Forms */}
        <Col xs={24} lg={16}>
          {/* Profile Info */}
          <Card
            variant="borderless"
            className="mb-6 shadow-sm"
            title={
              <div className="flex items-center gap-2">
                <EditOutlined />
                <span>Informasi Profil</span>
              </div>
            }
            extra={
              !editingProfile && (
                <Button type="link" onClick={handleEditProfile}>
                  Edit
                </Button>
              )
            }
          >
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={onSaveProfile}
              initialValues={{
                name: user.name,
                email: user.email,
                username: user.username,
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="name"
                    label="Nama Lengkap"
                    rules={[{ required: true, message: 'Nama harus diisi' }]}
                  >
                    <Input disabled={!editingProfile} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                      { required: true, message: 'Username harus diisi' },
                    ]}
                  >
                    <Input disabled={!editingProfile} />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Email harus diisi' },
                      { type: 'email', message: 'Format email tidak valid' },
                    ]}
                  >
                    <Input disabled={!editingProfile} />
                  </Form.Item>
                </Col>
              </Row>

              {editingProfile && (
                <div className="flex justify-end gap-2">
                  <Button onClick={handleCancelProfile}>Batal</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loadingUpdateUser}
                  >
                    Simpan
                  </Button>
                </div>
              )}
            </Form>
          </Card>

          {/* Change Password */}
          <Card
            variant="borderless"
            className="shadow-sm"
            title={
              <div className="flex items-center gap-2">
                <LockOutlined />
                <span>Ubah Password</span>
              </div>
            }
            extra={
              !editingPassword && (
                <Button type="link" onClick={() => setEditingPassword(true)}>
                  Ubah
                </Button>
              )
            }
          >
            {editingPassword ? (
              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={onSavePassword}
              >
                <Form.Item
                  name="password"
                  label="Password Baru"
                  rules={[
                    { required: true, message: 'Password baru harus diisi' },
                    { min: 6, message: 'Password minimal 6 karakter' },
                  ]}
                >
                  <Input.Password placeholder="Masukkan password baru" />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Konfirmasi Password"
                  rules={[
                    {
                      required: true,
                      message: 'Konfirmasi password harus diisi',
                    },
                  ]}
                >
                  <Input.Password placeholder="Ulangi password baru" />
                </Form.Item>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      setEditingPassword(false);
                      passwordForm.resetFields();
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loadingUpdateUser}
                  >
                    Simpan Password
                  </Button>
                </div>
              </Form>
            ) : (
              <Text type="secondary">
                Password tidak ditampilkan demi keamanan. Klik &quot;Ubah&quot;
                untuk mengganti password.
              </Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Page;

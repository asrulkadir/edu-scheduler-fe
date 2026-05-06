'use client';

import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from '@/hooks/useUser';
import { TCreateUserRequest, TUser } from '@/libs/types/user';
import { PlusOutlined } from '@ant-design/icons';
import { useContext, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import { ERole } from '@/libs/utils/enum';
import EditableTable from '@/components/EditableTable';
import { Button, Form, Input, Modal, Select, TableColumnProps } from 'antd';
import { getDifferences } from '@/libs/utils/helpers';
import { useMessage } from '@/hooks/useMessage';
import { useTeacher } from '@/hooks/useTeacher';

const Page = () => {
  const message = useMessage();
  const { user } = useContext(UserContext);
  const { users, loadingUsers, mutate } = useUsers();
  const { updateUser, loadingUpdateUser } = useUpdateUser();
  const { deleteUser, loadingDeleteUser } = useDeleteUser();
  const { createUser, loadingCreateUser } = useCreateUser();
  const { teachers, loadingTeachers } = useTeacher();
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    undefined,
  );
  const [form] = Form.useForm();

  const data = users ?? [];

  // Teachers that don't yet have a linked user account
  const availableTeachers = (teachers ?? []).filter(
    (t) => !data.some((u) => u.teacherId === t.id),
  );

  const handleSave = async (key: React.Key, row: TUser) => {
    const newData = {
      ...row,
      id: key.toString(),
    };
    const previousData = data.find((item) => item.id === key);

    const diff = getDifferences<TUser>(newData, previousData);

    await updateUser(
      { id: key.toString(), ...diff },
      {
        onError: (error) => {
          message.error(error.message);
        },
        onSuccess(data) {
          message.success(data.message);
          mutate();
        },
      },
    );
  };

  const handleDelete = (key: React.Key) => {
    deleteUser(
      { id: key.toString() },
      {
        onError: (error) => {
          message.error(error.message);
        },
        onSuccess(data) {
          message.success(data.message);
          mutate();
        },
      },
    );
  };

  const columns: (TableColumnProps<TUser> & {
    editable?: boolean;
    inputType?: 'text' | 'role';
  })[] = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      editable: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      editable: true,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      editable: true,
      inputType: 'role',
    },
  ];

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedRole(undefined);
    form.resetFields();
  };

  const onFinish = (values: TCreateUserRequest) => {
    createUser(values, {
      onError: (error) => {
        message.error(error.message, 5);
      },
      onSuccess(data) {
        message.success(data.message);
        mutate();
        form.resetFields();
        setSelectedRole(undefined);
        setOpen(false);
      },
    });
  };

  return (
    <>
      <div>
        <h1 className="mb-4 text-2xl font-bold">Daftar User</h1>
        <Button
          className="mb-4"
          icon={<PlusOutlined />}
          onClick={showModal}
          type="primary"
          size="large"
        >
          Tambah User
        </Button>
        <EditableTable<TUser>
          data={data}
          columns={columns}
          onSave={handleSave}
          onDelete={handleDelete}
          loading={loadingUsers || loadingUpdateUser || loadingDeleteUser}
          editable={user?.role === ERole.SUPERADMIN}
          deletable={user?.role === ERole.SUPERADMIN}
        />
      </div>
      <Modal
        title="Tambah User"
        open={open}
        onOk={handleOk}
        confirmLoading={loadingCreateUser}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel} type="primary" danger>
            Batal
          </Button>,
          <Button
            key="submit"
            loading={loadingCreateUser}
            onClick={handleOk}
            type="primary"
          >
            Tambah
          </Button>,
        ]}
      >
        <Form onFinish={onFinish} layout="vertical" form={form}>
          <Form.Item<TCreateUserRequest>
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Harap pilih role!' }]}
          >
            <Select
              options={[
                { value: ERole.ADMIN, label: 'Admin' },
                { value: ERole.TEACHER, label: 'Guru' },
              ]}
              placeholder="Pilih role"
              onChange={(val) => {
                setSelectedRole(val);
                form.setFieldsValue({ teacherId: undefined, name: undefined });
              }}
            />
          </Form.Item>

          {selectedRole === ERole.TEACHER && (
            <Form.Item<TCreateUserRequest>
              label="Profil Guru"
              name="teacherId"
              rules={[{ required: true, message: 'Harap pilih profil guru!' }]}
              extra="Hanya guru yang belum memiliki akun login"
            >
              <Select
                loading={loadingTeachers}
                placeholder="Cari dan pilih profil guru"
                showSearch
                filterOption={(input, option) =>
                  (option?.label as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={availableTeachers.map((t) => ({
                  value: t.id,
                  label: t.name,
                }))}
                onChange={(val) => {
                  const teacher = availableTeachers.find((t) => t.id === val);
                  if (teacher) {
                    form.setFieldValue('name', teacher.name);
                  }
                }}
              />
            </Form.Item>
          )}

          <Form.Item<TCreateUserRequest>
            label="Nama"
            name="name"
            rules={[{ required: true, message: 'Harap masukkan nama!' }]}
          >
            <Input
              placeholder={
                selectedRole === ERole.TEACHER
                  ? 'Otomatis terisi dari profil guru'
                  : 'Masukkan nama'
              }
              disabled={selectedRole === ERole.TEACHER}
            />
          </Form.Item>

          <Form.Item<TCreateUserRequest>
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Harap masukkan username!' }]}
          >
            <Input placeholder="Masukkan username" />
          </Form.Item>

          <Form.Item<TCreateUserRequest>
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Email tidak sesuai!',
                type: 'email',
              },
            ]}
          >
            <Input placeholder="Masukkan email" />
          </Form.Item>

          <Form.Item<TCreateUserRequest>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Harap masukkan password!' }]}
          >
            <Input.Password placeholder="Masukkan password" />
          </Form.Item>

          <Form.Item<TCreateUserRequest>
            label="Konfirmasi Password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                validator: (_, value) => {
                  if (!value || form.getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Konfirmasi password tidak sesuai!');
                },
              },
            ]}
          >
            <Input.Password placeholder="Masukkan konfirmasi password" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Page;

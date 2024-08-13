'use client';

import ButtonComp from "@/components/Button";
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from "@/hooks/useUser";
import { TCreateUserRequest, TUser } from "@/libs/types/user";
import { PlusOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { ERole } from "@/libs/utils/enum";
import EditableTable from "@/components/EditableTable";
import { Form, Input, message, Modal, Select, TableColumnProps } from "antd";

const Page = () => {
  const user = useContext(UserContext);
  const { users, loadingUsers, mutate } = useUsers();
  const { updateUser, loadingUpdateUser } = useUpdateUser();
  const {deleteUser, loadingDeleteUser} = useDeleteUser();
  const {createUser, loadingCreateUser} = useCreateUser();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const [data, setData] = useState<TUser[]>([]);

  useEffect(() => {
    if (users) {
      setData(users);
    }
  }, [users]);

  const handleSave = async (key: React.Key, row: TUser) => {
    const newData = {
      ...row,
      id: key.toString(),
    };
    const previousData = data.find((item) => item.id === key);

    // Get the difference between the new data and the previous data
    const diff = Object.fromEntries(
      Object.entries(newData).filter(
        ([key, value]) => previousData && value !== previousData[key as keyof TUser]
      )
    );
    
    await updateUser({ id: key.toString(), ...diff }, {
      onError: (error) => {
        message.error(error.message);
      },
      onSuccess(data) {
        message.success(data.message);
        mutate();
      },
    });
  };

  const handleDelete = (key: React.Key) => {
    deleteUser({ id: key.toString() }, {
      onError: (error) => {
        message.error(error.message);
      },
      onSuccess(data) {
        message.success(data.message);
        mutate();
      },
    });
  };
  
  const columns: (TableColumnProps<TUser> & { editable?: boolean })[] = [
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
        setOpen(false);
      },
    });
  };
  
  return (
    <>
      <div>
        <h1
          className="mb-4 text-2xl font-bold"
        >
          Daftar User
        </h1>
        <ButtonComp
          title="Tambah User"
          className="mb-4"
          icon={<PlusOutlined />}
          onClick={showModal}
        />
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
          <ButtonComp 
            key="back" 
            onClick={handleCancel} 
            title="Batal" 
            color="danger"
          />,
          <ButtonComp
            key="submit"
            loading={loadingCreateUser}
            onClick={handleOk}
            title="Tambah"
          />
        ]}
      >
        <Form
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          form={form}
        >
          <Form.Item<TCreateUserRequest>
            label="Nama"
            name="name"
            rules={[{ required: true, message: 'Harap masukkan nama anda!' }]}
          >
            <Input
              placeholder="Masukkan nama"
            />
          </Form.Item>

          <Form.Item<TCreateUserRequest>
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Harap masukkan username!' }]}
          >
            <Input
              placeholder="Masukkan username"
            />
          </Form.Item>

          <Form.Item<TCreateUserRequest>
            label="Email"
            name="email"
            rules={[{ 
              required: true, 
              message: 'Email tidak sesuai!',
              type: 'email', 
            }]}
          >
            <Input
              placeholder="Masukkan email"
            />
          </Form.Item>

          <Form.Item<TCreateUserRequest>
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Harap pilih role!' }]}
          >
            <Select
              options={[
                { value: ERole.ADMIN, label: ERole.ADMIN },
                { value: ERole.TEACHER, label: ERole.TEACHER },
                { value: ERole.STUDENT, label: ERole.STUDENT },
              ]}
              placeholder="Pilih role"
            />
          </Form.Item>

          <Form.Item<TCreateUserRequest>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Harap massukkan password!' }]}
          >
            <Input.Password
              placeholder="Masukkan password"
            />
          </Form.Item>

          <Form.Item<TCreateUserRequest>
            label="Konfirmasi Password"
            name="confirmPassword"
            rules={
              [
                { 
                  required: true,
                  validator: (_, value) => {
                    if (!value || form.getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Konfirmasi password tidak sesuai!');
                  }
                }
              ]}
          >
            <Input.Password
              placeholder="Masukkan konfirmasi password"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Page;
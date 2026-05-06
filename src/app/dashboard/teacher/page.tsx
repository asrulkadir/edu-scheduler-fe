'use client';

import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  TableColumnProps,
  Tag,
} from 'antd';
import { useMessage } from '@/hooks/useMessage';
import { PlusOutlined } from '@ant-design/icons';
import EditableTable from '@/components/EditableTable';
import { TCreateTeacherRequest, TTeacher } from '@/libs/types/teacher';
import { useContext, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import { EGender, ERole } from '@/libs/utils/enum';
import {
  useCreateTeacher,
  useDeleteTeacher,
  useTeacher,
  useUpdateTeacher,
} from '@/hooks/useTeacher';
import { getDifferences } from '@/libs/utils/helpers';
import { TNameId } from '@/libs/types/common';
import { useSubjects } from '@/hooks/useSubjects';
import SelectComp from '@/components/Select';

const Page = () => {
  const message = useMessage();
  const { user } = useContext(UserContext);
  const permission =
    user?.role === ERole.SUPERADMIN || user?.role === ERole.ADMIN;
  const [open, setOpen] = useState(false);
  const { teachers, mutateTeachers, loadingTeachers } = useTeacher();
  const { updateTeacher, loadingUpdateTeacher } = useUpdateTeacher();
  const { deleteTeacher, loadingDeleteTeacher } = useDeleteTeacher();
  const { createTeacher, loadingCreateTeacher } = useCreateTeacher();
  const { subjects } = useSubjects();
  const [form] = Form.useForm();

  const data = teachers ?? [];

  const showModal = () => {
    setOpen(true);
  };

  const columns: (TableColumnProps<TTeacher> & {
    editable?: boolean;
    inputType?: 'text' | 'gender' | 'customSelectMultiple';
    dataSelect?: TNameId[];
  })[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'NIP',
      dataIndex: 'nip',
      key: 'nip',
      editable: true,
    },
    {
      title: 'Jenis Kelamin',
      dataIndex: 'gender',
      key: 'gender',
      editable: true,
      inputType: 'gender',
      render: (text) => {
        if (text === EGender.male) {
          return <span>Laki-laki</span>;
        } else if (text === EGender.female) {
          return <span>Perempuan</span>;
        }
        return null;
      },
    },
    {
      title: 'Nomor HP',
      dataIndex: 'phone',
      key: 'phone',
      editable: true,
    },
    {
      title: 'Alamat',
      dataIndex: 'address',
      key: 'address',
      editable: true,
    },
    {
      title: 'Mata Pelajaran',
      dataIndex: 'subjects',
      key: 'subjects',
      editable: true,
      inputType: 'customSelectMultiple',
      render: (text) =>
        text.map((item: TNameId) => (
          <Tag key={item.id} color="blue" className="m-0.5">
            {item.name}
          </Tag>
        )),
      dataSelect: subjects,
    },
  ];

  const handleSave = async (key: React.Key, row: TTeacher) => {
    const newData = {
      ...row,
      id: key.toString(),
    };
    const previousData = data.find((item) => item.id === key);

    const diff = getDifferences<TTeacher>(newData, previousData);

    await updateTeacher(
      {
        id: key.toString(),
        ...diff,
      },
      {
        onError: (error) => {
          message.error(error.message);
        },
        onSuccess(data) {
          message.success(data.message);
          mutateTeachers();
        },
      },
    );
  };

  const handleDelete = async (key: React.Key) => {
    await deleteTeacher(
      { id: key.toString() },
      {
        onError: (error) => {
          message.error(error.message);
        },
        onSuccess(data) {
          message.success(data.message);
          mutateTeachers();
        },
      },
    );
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onFinish = (values: TCreateTeacherRequest) => {
    createTeacher(values, {
      onError: (error) => {
        message.error(error.message);
      },
      onSuccess(data) {
        message.success(data.message);
        mutateTeachers();
        form.resetFields();
        setOpen(false);
      },
    });
  };

  return (
    <>
      <div>
        <h1 className="mb-4 text-2xl font-bold">Daftar Guru</h1>
        <Button
          className="mb-4"
          icon={<PlusOutlined />}
          onClick={showModal}
          type="primary"
          size="large"
        >
          Tambah Guru
        </Button>
        <EditableTable<TTeacher>
          data={data}
          columns={columns}
          onSave={handleSave}
          onDelete={handleDelete}
          loading={
            loadingTeachers || loadingUpdateTeacher || loadingDeleteTeacher
          }
          editable={permission}
          deletable={permission}
          scroll={{ x: 500 }}
        />
      </div>
      <Modal
        title="Tambah Guru"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Batal
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={loadingCreateTeacher}
          >
            Simpan
          </Button>,
        ]}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item<TCreateTeacherRequest>
            name="name"
            label="Nama"
            rules={[{ required: true, message: 'Nama harus diisi' }]}
          >
            <Input placeholder="Masukkan nama guru" />
          </Form.Item>
          <Form.Item<TCreateTeacherRequest>
            name="nip"
            label="NIP"
            rules={[{ required: true, message: 'NIP harus diisi' }]}
          >
            <Input placeholder="Masukkan NIP guru" />
          </Form.Item>
          <Form.Item<TCreateTeacherRequest>
            name="gender"
            label="Jenis Kelamin"
            rules={[{ required: true, message: 'Jenis kelamin harus diisi' }]}
          >
            <Select
              options={[
                { value: EGender.male, label: 'Laki-laki' },
                { value: EGender.female, label: 'Perempuan' },
              ]}
              placeholder="Pilih jenis kelamin"
            />
          </Form.Item>
          <Form.Item<TCreateTeacherRequest>
            name="phone"
            label="No. HP"
            rules={[
              {
                //validate phone number
                pattern: new RegExp(/^[0-9\b]+$/),
                message: 'No. HP harus berupa angka',
              },
            ]}
          >
            <Input placeholder="Masukkan no. HP guru" />
          </Form.Item>
          <Form.Item name="address" label="Alamat">
            <Input placeholder="Masukkan alamat guru" />
          </Form.Item>
          <Form.Item<TCreateTeacherRequest>
            name="subjects"
            label="Mata Pelajaran"
          >
            <SelectComp
              mode="multiple"
              options={subjects?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              placeholder="Pilih mata pelajaran"
            />
          </Form.Item>

          <div className="my-4 border-t border-gray-200" />
          <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">
            Akun Login
          </p>

          <Form.Item<TCreateTeacherRequest>
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Username harus diisi' },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: 'Username hanya boleh huruf, angka, dan underscore',
              },
            ]}
          >
            <Input placeholder="Masukkan username" />
          </Form.Item>
          <Form.Item<TCreateTeacherRequest>
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email harus diisi' },
              { type: 'email', message: 'Format email tidak valid' },
            ]}
          >
            <Input placeholder="Masukkan email" />
          </Form.Item>
          <Form.Item<TCreateTeacherRequest>
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Password harus diisi' },
              { min: 6, message: 'Password minimal 6 karakter' },
              {
                pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
                message:
                  'Password harus mengandung huruf besar, huruf kecil, dan angka',
              },
            ]}
          >
            <Input.Password placeholder="Masukkan password" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Page;

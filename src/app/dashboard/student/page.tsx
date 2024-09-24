'use client';

import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  TableColumnProps,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import EditableTable from '@/components/EditableTable';
import { TCreateStudentRequest, TStudent } from '@/libs/types/student';
import { useContext, useEffect, useState } from 'react';
import { EGender, ERole } from '@/libs/utils/enum';
import { useClass } from '@/hooks/useClass';
import {
  useCreateStudent,
  useDeleteStudent,
  useStudents,
  useUpdateStudent,
} from '@/hooks/useStudent';
import { TNameId } from '@/libs/types/common';
import { UserContext } from '@/context/UserContext';
import { getDifferences } from '@/libs/utils/helpers';

const Page = () => {
  const { user } = useContext(UserContext);
  const permission =
    user?.role === ERole.SUPERADMIN || user?.role === ERole.ADMIN;
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<TStudent[]>([]);
  const { students, loadingStudents, mutateStudents } = useStudents();
  const { updateStudent, loadingUpdateStudent } = useUpdateStudent();
  const { createStudent, loadingCreateStudent } = useCreateStudent();
  const { deleteStudent, loadingDeleteStudent } = useDeleteStudent();

  const { classesData, loadingClass } = useClass();

  useEffect(() => {
    if (students) {
      setData(students);
    }
  }, [students]);

  const showModal = () => {
    setOpen(true);
  };

  const columns: (TableColumnProps<TStudent> & {
    editable?: boolean;
    inputType?: 'text' | 'gender' | 'customSelect';
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
      dataIndex: 'nis',
      key: 'nis',
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
      title: 'Kelas',
      dataIndex: 'classId',
      key: 'subjects',
      editable: true,
      inputType: 'customSelect',
      dataSelect: classesData,
      render: (text) => {
        const classData = classesData?.find((item) => item.id === text);
        return classData?.name;
      },
    },
  ];

  const handleSave = async (key: React.Key, row: TStudent) => {
    const newData = {
      ...row,
      id: key.toString(),
    };
    const previousData = data.find((item) => item.id === key);

    const diff = getDifferences<TStudent>(newData, previousData);

    await updateStudent(
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
          mutateStudents();
        },
      },
    );
  };

  const handleDelete = async (key: React.Key) => {
    await deleteStudent(
      { id: key.toString() },
      {
        onError: (error) => {
          message.error(error.message);
        },
        onSuccess(data) {
          message.success(data.message);
          mutateStudents();
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

  const onFinish = (values: TCreateStudentRequest) => {
    createStudent(values, {
      onError: (error) => {
        message.error(error.message);
      },
      onSuccess(data) {
        message.success(data.message);
        mutateStudents();
        setOpen(false);
      },
    });
  };

  return (
    <>
      <div>
        <h1 className="mb-4 text-2xl font-bold">Daftar Siswa</h1>
        <Button
          className="mb-4"
          icon={<PlusOutlined />}
          onClick={showModal}
          type="primary"
        >
          Tambah Siswa
        </Button>
        <EditableTable<TStudent>
          data={data}
          columns={columns}
          onSave={handleSave}
          onDelete={handleDelete}
          loading={
            loadingStudents || loadingUpdateStudent || loadingDeleteStudent
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
            loading={loadingCreateStudent}
          >
            Simpan
          </Button>,
        ]}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item<TCreateStudentRequest>
            name="name"
            label="Nama"
            rules={[{ required: true, message: 'Nama harus diisi' }]}
          >
            <Input placeholder="Masukkan nama siswa" />
          </Form.Item>
          <Form.Item<TCreateStudentRequest>
            name="nis"
            label="NIS"
            rules={[{ required: true, message: 'NIS harus diisi' }]}
          >
            <Input placeholder="Masukkan NIS siswa" />
          </Form.Item>
          <Form.Item<TCreateStudentRequest>
            name="gender"
            label="Jenis Kelamin"
            rules={[{ required: true, message: 'Jenis kelamin harus diisi' }]}
          >
            <Select
              options={[
                { value: EGender.male, label: 'Laki-laki' },
                { varlue: EGender.female, label: 'Perempuan' },
              ]}
              placeholder="Pilih jenis kelamin"
            />
          </Form.Item>
          <Form.Item name="classId" label="Kelas">
            <Select
              options={classesData?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              placeholder="Pilih Kelas"
              loading={loadingClass}
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Page;

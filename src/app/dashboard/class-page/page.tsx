/* eslint-disable react/jsx-wrap-multilines */
'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Tag,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  useClass,
  useCreateClass,
  useDeleteClass,
  useUpdateClass,
} from '@/hooks/useClass';
import {
  TClass,
  TCreateClassRequest,
  TUpdateClassRequest,
} from '@/libs/types/class';
import { truncateText } from '@/libs/utils/helpers';
import { useTeacher } from '@/hooks/useTeacher';
import { useSubjects } from '@/hooks/useSubjects';
import { useStudents } from '@/hooks/useStudent';
import SelectComp from '@/components/Select';

const Page = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [keyEdit, setKeyEdit] = useState('');
  const { classesData, mutateClass } = useClass();
  const { createClass, loadingCreateClass } = useCreateClass();
  const { updateClass, loadingUpdateClass } = useUpdateClass();
  const { deleteClass } = useDeleteClass();
  const { teachers, loadingTeachers } = useTeacher();
  const { subjects, loadingSubjects } = useSubjects();
  const { students, loadingStudents } = useStudents();

  const showModalAddEdit = (isEditable: string, data?: TClass) => {
    setOpen(true);
    setKeyEdit(isEditable);
    if (data) {
      form.setFieldsValue({
        name: data.name,
        description: data.description,
        homeroomTeacherId: data.homeroomTeacherId,
        subjects: data.subjects?.map((item) => item.id),
        students: data.students?.map((item) => item.id),
      });
    } else {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onFinish = (values: TCreateClassRequest) => {
    if (keyEdit) {
      const filteredValue = Object.fromEntries(
        Object.entries(values).filter(
          ([, value]) => value !== null && value !== '',
        ),
      );
      updateClass(
        {
          ...filteredValue,
          id: keyEdit,
        },
        {
          onError: (error) => {
            message.error(error.message);
          },
          onSuccess(data) {
            message.success(data.message);
            mutateClass();
            setOpen(false);
            form.resetFields();
          },
        },
      );
    } else {
      createClass(values, {
        onError: (error) => {
          message.error(error.message);
        },
        onSuccess(data) {
          message.success(data.message);
          mutateClass();
          setOpen(false);
          form.resetFields();
        },
      });
    }
  };

  const onDelete = (id: string) => {
    deleteClass(
      { id },
      {
        onError: (error) => {
          message.error(error.message);
        },
        onSuccess(data) {
          message.success(data.message);
          mutateClass();
        },
      },
    );
  };

  return (
    <>
      <div>
        <h1 className="mb-6 text-3xl font-extrabold text-gray-800">
          Daftar Kelas
        </h1>
        <Button
          className="mb-6"
          icon={<PlusOutlined />}
          onClick={() => showModalAddEdit('')}
          type="primary"
          size="large"
        >
          Tambah Kelas
        </Button>
        <div className="grid grid-cols-3 gap-6">
          {classesData?.map((classData) => (
            <Card
              key={classData.id}
              title={
                <Tooltip
                  title={classData.name.length > 15 ? classData.name : null}
                >
                  <div className="text-xl font-bold flex items-center">
                    <BookOutlined className="mr-2" />
                    {truncateText(classData.name)}
                  </div>
                </Tooltip>
              }
              className="shadow-lg hover:shadow-xl transition-shadow bg-white rounded-lg border border-gray-200"
              extra={
                <div>
                  <Tooltip title="Lihat detail" placement="topRight">
                    <Button type="link" icon={<EyeOutlined />} />
                  </Tooltip>
                  <Tooltip title="Edit" placement="topRight">
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => showModalAddEdit(classData.id, classData)}
                    />
                  </Tooltip>
                  <Tooltip title="Hapus" placement="topRight">
                    <Popconfirm
                      title="Yakin ingin hapus?"
                      onConfirm={() => onDelete(classData.id)}
                      okText="Ya"
                      cancelText="Tidak"
                    >
                      <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Tooltip>
                </div>
              }
            >
              <p className="mb-4 text-center">{classData.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className=" text-center font-bold">
                    <UserOutlined className="mr-2" /> Wali Kelas
                  </p>
                  <p className="text-center">
                    {classData.homeroomTeacher?.name ?? '-'}
                  </p>
                </div>
                <div>
                  <p className="text-center font-bold">Jumlah Siswa</p>
                  <p className="text-center">
                    {classData.students?.length ?? 0}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-center font-bold">Mata Pelajaran</p>
                  <div className="mt-2 flex justify-center">
                    {classData.subjects?.length ? (
                      classData.subjects?.map((subject) => (
                        <Tag key={subject.id} color="blue">
                          {subject.name}
                        </Tag>
                      ))
                    ) : (
                      <p className="text-center">Tidak ada mata pelajaran.</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Modal
        title={keyEdit ? 'Edit Kelas' : 'Tambah Kelas'}
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
            loading={loadingCreateClass || loadingUpdateClass}
          >
            Simpan
          </Button>,
        ]}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item<TCreateClassRequest | TUpdateClassRequest>
            name="name"
            label="Nama"
            rules={[{ required: true, message: 'Nama harus diisi' }]}
          >
            <Input placeholder="Masukkan nama kelas" />
          </Form.Item>
          <Form.Item<TCreateClassRequest | TUpdateClassRequest>
            name="description"
            label="Deskripsi"
          >
            <Input placeholder="Masukkan deskripsi kelas" />
          </Form.Item>
          <Form.Item<TCreateClassRequest | TUpdateClassRequest>
            name="homeroomTeacherId"
            label="Wali Kelas"
          >
            <Select
              options={teachers?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              placeholder="Pilih wali kelas"
              loading={loadingTeachers}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item<TCreateClassRequest | TUpdateClassRequest>
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
              loading={loadingSubjects}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item<TCreateClassRequest | TUpdateClassRequest>
            name="students"
            label="Siswa"
          >
            <SelectComp
              mode="multiple"
              options={students?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              placeholder="Pilih siswa"
              loading={loadingStudents}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toString()
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

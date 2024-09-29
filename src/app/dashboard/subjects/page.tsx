'use client';

import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Spin,
  Tag,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  BookOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  useCreateSubjects,
  useDeleteSubjects,
  useSubjects,
  useUpdateSubjects,
} from '@/hooks/useSubjects';
import { truncateText } from '@/libs/utils/helpers';
import { useState } from 'react';
import {
  TCreateSubjectsRequest,
  TSubjects,
  TUpdateSubjectsRequest,
} from '@/libs/types/subjects';
import SelectComp from '@/components/Select';
import { useTeacher } from '@/hooks/useTeacher';

const Page = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [keyEdit, setKeyEdit] = useState('');
  const { subjects, loadingSubjects, mutateSubjects } = useSubjects();
  const { createSubjects, loadingCreateSubjects } = useCreateSubjects();
  const { updateSubjects, loadingUpdateSubjects } = useUpdateSubjects();
  const { deleteSubjects } = useDeleteSubjects();
  const { teachers, loadingTeachers } = useTeacher();

  const showModalAddEdit = (isEditable: string, data?: TSubjects) => {
    setOpen(true);
    setKeyEdit(isEditable);
    if (data) {
      form.setFieldsValue({
        name: data.name,
        description: data.description,
        teacher: data.teacher?.map((item) => item.id),
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

  const onFinish = (values: TCreateSubjectsRequest) => {
    if (keyEdit) {
      const filteredValue = Object.fromEntries(
        Object.entries(values).filter(
          ([, value]) => value !== null && value !== '',
        ),
      );
      updateSubjects(
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
            mutateSubjects();
            setOpen(false);
            form.resetFields();
          },
        },
      );
    } else {
      createSubjects(values, {
        onError: (error) => {
          message.error(error.message);
        },
        onSuccess(data) {
          message.success(data.message);
          mutateSubjects();
          setOpen(false);
          form.resetFields();
        },
      });
    }
  };

  const onDelete = (id: string) => {
    deleteSubjects(
      { id },
      {
        onError: (error) => {
          message.error(error.message);
        },
        onSuccess(data) {
          message.success(data.message);
          mutateSubjects();
        },
      },
    );
  };

  return (
    <>
      <div>
        <h1 className="mb-6 text-2xl font-extrabold text-gray-800">
          Daftar Mata Pelajaran
        </h1>
        <Button
          className="mb-6"
          icon={<PlusOutlined />}
          onClick={() => showModalAddEdit('')}
          type="primary"
          size="large"
        >
          Tambah Mata Pelajaran
        </Button>
        <div className="grid grid-cols-3 gap-6">
          {loadingSubjects && <Spin />}
          {subjects?.map((subject) => (
            <Card
              key={subject.id}
              title={
                <Tooltip title={subject.name.length > 15 ? subject.name : null}>
                  <div className="flex items-center text-xl font-bold">
                    <BookOutlined className="mr-2" />
                    {truncateText(subject.name, 20)}
                  </div>
                </Tooltip>
              }
              className="rounded-lg border border-gray-200 bg-white shadow-lg transition-shadow hover:shadow-xl"
              extra={
                <div>
                  <Tooltip title="Edit" placement="topRight">
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => showModalAddEdit(subject.id, subject)}
                    />
                  </Tooltip>
                  <Tooltip title="Hapus" placement="topRight">
                    <Popconfirm
                      title="Yakin ingin hapus?"
                      onConfirm={() => onDelete(subject.id)}
                      okText="Ya"
                      cancelText="Tidak"
                    >
                      <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Tooltip>
                </div>
              }
            >
              <div className="col-span-2">
                <p className="text-center font-bold">
                  Deskripsi Mata Pelajaran:
                </p>
                <div className="mt-2 flex justify-center">
                  {subject.description}
                </div>
              </div>
              <Divider />
              <div className="col-span-2">
                <p className="text-center font-bold">Guru Mata Pelajaran:</p>
                <div className="mt-2 flex justify-center">
                  {subject.teacher?.length ? (
                    subject.teacher?.map((t) => (
                      <Tag key={t.id} color="blue">
                        {t.name}
                      </Tag>
                    ))
                  ) : (
                    <p className="text-center">
                      Belum ada guru yang mengajar mata pelajaran ini
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Modal
        title={keyEdit ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
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
            loading={loadingCreateSubjects || loadingUpdateSubjects}
          >
            Simpan
          </Button>,
        ]}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item<TCreateSubjectsRequest | TUpdateSubjectsRequest>
            name="name"
            label="Nama"
            rules={[{ required: true, message: 'Nama harus diisi' }]}
          >
            <Input placeholder="Masukkan nama mata pelajaran" />
          </Form.Item>
          <Form.Item<TCreateSubjectsRequest | TUpdateSubjectsRequest>
            name="description"
            label="Deskripsi"
          >
            <Input.TextArea placeholder="Masukkan deskripsi mata pelajaran" />
          </Form.Item>
          <Form.Item<TCreateSubjectsRequest | TUpdateSubjectsRequest>
            name="teacher"
            label="Guru Mata Pelajaran"
          >
            <SelectComp
              mode="multiple"
              options={teachers?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              placeholder="Pilih guru mata pelajaran"
              loading={loadingTeachers}
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? '')
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

'use client';

import {
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Skeleton,
  Tag,
  Tooltip,
} from 'antd';
import { useMessage } from '@/hooks/useMessage';
import {
  PlusOutlined,
  BookOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  useCreateSubjects,
  useDeleteSubjects,
  useSubjects,
  useUpdateSubjects,
} from '@/hooks/useSubjects';
import { useState } from 'react';
import {
  TCreateSubjectsRequest,
  TSubjects,
  TUpdateSubjectsRequest,
} from '@/libs/types/subjects';
import SelectComp from '@/components/Select';
import { useTeacher } from '@/hooks/useTeacher';

const Page = () => {
  const message = useMessage();
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
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            Daftar Mata Pelajaran
          </h1>
          <p className="text-sm text-gray-500">
            {subjects?.length ?? 0} mata pelajaran terdaftar
          </p>
        </div>
        <Button
          icon={<PlusOutlined />}
          onClick={() => showModalAddEdit('')}
          type="primary"
          size="large"
          className="rounded-xl"
        >
          Tambah Mata Pelajaran
        </Button>
      </div>

      {/* Grid */}
      {loadingSubjects ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md"
            >
              <Skeleton active />
            </div>
          ))}
        </div>
      ) : (subjects?.length ?? 0) === 0 ? (
        <Empty description="Belum ada mata pelajaran" />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subjects?.map((subject) => {
            const teacherCount = subject.teacher?.length ?? 0;
            const visibleTeachers = subject.teacher?.slice(0, 3) ?? [];
            const extraTeachers = teacherCount - 3;
            return (
              <div
                key={subject.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                {/* Card header */}
                <div className="flex items-start justify-between px-5 py-4">
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="mb-1 flex items-center gap-2">
                      <BookOutlined />
                      <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                        Mata Pelajaran
                      </span>
                    </div>
                    <h2 className="line-clamp-2 text-xl leading-tight font-bold text-gray-800">
                      {subject.name}
                    </h2>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Tooltip title="Edit">
                      <button
                        onClick={() => showModalAddEdit(subject.id, subject)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-500 transition hover:bg-blue-500/80"
                      >
                        <EditOutlined />
                      </button>
                    </Tooltip>
                    <Tooltip title="Hapus">
                      <Popconfirm
                        title="Yakin ingin hapus mata pelajaran ini?"
                        onConfirm={() => onDelete(subject.id)}
                        okText="Hapus"
                        cancelText="Batal"
                        okButtonProps={{ danger: true }}
                      >
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-500 transition hover:bg-red-500/80">
                          <DeleteOutlined />
                        </button>
                      </Popconfirm>
                    </Tooltip>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-4 p-5">
                  {subject.description && (
                    <p className="line-clamp-2 text-sm text-gray-500">
                      {subject.description}
                    </p>
                  )}

                  {/* Stats row */}
                  <div className="grid grid-cols-2 divide-x divide-gray-100 rounded-xl border border-gray-100 bg-gray-50">
                    <div className="flex flex-col items-center py-3">
                      <BookOutlined className="text-teal-500" />
                      <span className="mt-1 text-xs text-gray-400">
                        Mata Pelajaran
                      </span>
                      <span className="mt-0.5 max-w-20 truncate text-center text-xs font-semibold text-gray-700">
                        {subject.name}
                      </span>
                    </div>
                    <div className="flex flex-col items-center py-3">
                      <UserOutlined className="text-blue-500" />
                      <span className="mt-1 text-xs text-gray-400">Guru</span>
                      <span className="mt-0.5 text-lg font-bold text-gray-800">
                        {teacherCount}
                      </span>
                    </div>
                  </div>

                  {/* Teacher tags */}
                  {teacherCount > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {visibleTeachers.map((t) => (
                        <Tag
                          key={t.id}
                          color="blue"
                          className="m-0 rounded-full text-xs"
                        >
                          {t.name}
                        </Tag>
                      ))}
                      {extraTeachers > 0 && (
                        <Tag
                          color="default"
                          className="m-0 rounded-full text-xs"
                        >
                          +{extraTeachers} lagi
                        </Tag>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Belum ada guru yang mengajar
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
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

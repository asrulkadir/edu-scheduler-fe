'use client';

import { useState } from 'react';
import {
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Tag,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  UserOutlined,
  TeamOutlined,
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
import { useTeacher } from '@/hooks/useTeacher';
import { useSubjects } from '@/hooks/useSubjects';
import { useStudents } from '@/hooks/useStudent';
import SelectComp from '@/components/Select';
import { useRouter } from 'next/navigation';
import { useMessage } from '@/hooks/useMessage';

const Page = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const message = useMessage();
  const [open, setOpen] = useState(false);
  const [keyEdit, setKeyEdit] = useState('');
  const { classesData, mutateClass, loadingClass } = useClass();
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
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            Daftar Kelas
          </h1>
          <p className="text-sm text-gray-500">
            {classesData?.length ?? 0} kelas terdaftar
          </p>
        </div>
        <Button
          icon={<PlusOutlined />}
          onClick={() => showModalAddEdit('')}
          type="primary"
          size="large"
          className="rounded-xl"
        >
          Tambah Kelas
        </Button>
      </div>

      {/* Grid */}
      {loadingClass ? (
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
      ) : (classesData?.length ?? 0) === 0 ? (
        <Empty description="Belum ada kelas" />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classesData?.map((classData) => {
            const subjectCount = classData.subjects?.length ?? 0;
            const studentCount = classData.students?.length ?? 0;
            const visibleSubjects = classData.subjects?.slice(0, 3) ?? [];
            const extraSubjects = subjectCount - 3;
            return (
              <div
                key={classData.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className={`flex items-start justify-between px-5 py-4`}>
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="mb-1 flex items-center gap-2">
                      <BookOutlined />
                      <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                        Kelas
                      </span>
                    </div>
                    <h2 className="line-clamp-2 text-xl leading-tight font-bold text-gray-800">
                      {classData.name}
                    </h2>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Tooltip title="Edit">
                      <button
                        onClick={() =>
                          showModalAddEdit(classData.id, classData)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-500 transition hover:bg-blue-500/80"
                      >
                        <EditOutlined />
                      </button>
                    </Tooltip>
                    <Tooltip title="Hapus">
                      <Popconfirm
                        title="Yakin ingin hapus kelas ini?"
                        onConfirm={() => onDelete(classData.id)}
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
                  {classData.description && (
                    <p className="line-clamp-2 text-sm text-gray-500">
                      {classData.description}
                    </p>
                  )}

                  {/* Stats row */}
                  <div className="grid grid-cols-3 divide-x divide-gray-100 rounded-xl border border-gray-100 bg-gray-50">
                    <div className="flex flex-col items-center py-3">
                      <UserOutlined className="text-blue-500" />
                      <span className="mt-1 text-xs text-gray-400">
                        Wali Kelas
                      </span>
                      <span className="mt-0.5 max-w-18 truncate text-center text-xs font-semibold text-gray-700">
                        {classData.homeroomTeacher?.name ?? '-'}
                      </span>
                    </div>
                    <div className="flex flex-col items-center py-3">
                      <TeamOutlined className="text-indigo-500" />
                      <span className="mt-1 text-xs text-gray-400">Siswa</span>
                      <span className="mt-0.5 text-lg font-bold text-gray-800">
                        {studentCount}
                      </span>
                    </div>
                    <div className="flex flex-col items-center py-3">
                      <BookOutlined className="text-teal-500" />
                      <span className="mt-1 text-xs text-gray-400">Mapel</span>
                      <span className="mt-0.5 text-lg font-bold text-gray-800">
                        {subjectCount}
                      </span>
                    </div>
                  </div>

                  {/* Subject tags */}
                  {subjectCount > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {visibleSubjects.map((s) => (
                        <Tag
                          key={s.id}
                          color="blue"
                          className="m-0 rounded-full text-xs"
                        >
                          {s.name}
                        </Tag>
                      ))}
                      {extraSubjects > 0 && (
                        <Tag
                          color="default"
                          className="m-0 rounded-full text-xs"
                        >
                          +{extraSubjects} lagi
                        </Tag>
                      )}
                    </div>
                  )}

                  {/* Detail CTA */}
                  <button
                    onClick={() =>
                      router.push(`/dashboard/class-page/${classData.id}`)
                    }
                    className="mt-auto w-full rounded-xl border border-blue-100 bg-blue-50 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                  >
                    Lihat Detail →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
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
              showSearch={{
                filterOption: (input, option) =>
                  String(option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase()),
              }}
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
              showSearch={{
                filterOption: (input, option) =>
                  String(option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase()),
              }}
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
              showSearch={{
                filterOption: (input, option) =>
                  String(option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase()),
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Page;

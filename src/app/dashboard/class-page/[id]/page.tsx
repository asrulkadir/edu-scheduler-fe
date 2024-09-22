'use client';

import { useClassById, useUpdateClass } from '@/hooks/useClass';
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Form,
  Input,
  message,
  Modal,
  Select,
  Skeleton,
  Tag,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { TClass, TUpdateClassRequest } from '@/libs/types/class';
import { useTeacher } from '@/hooks/useTeacher';
import { useSubjects } from '@/hooks/useSubjects';
import { useStudents } from '@/hooks/useStudent';
import SelectComp from '@/components/Select';
import Link from 'next/link';

export default function Page({
  params,
}: {
  readonly params: { readonly id: string };
}) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { classData, mutate, loadingClassById } = useClassById(params.id);
  const { updateClass, loadingUpdateClass } = useUpdateClass();
  const { teachers, loadingTeachers } = useTeacher();
  const { subjects, loadingSubjects } = useSubjects();
  const { students, loadingStudents } = useStudents();

  const showModalEdit = (data?: TClass) => {
    setOpen(true);
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

  const onFinish = (values: TUpdateClassRequest) => {
    const filteredValue = Object.fromEntries(
      Object.entries(values).filter(
        ([, value]) => value !== null && value !== '',
      ),
    );
    updateClass(
      {
        ...filteredValue,
        id: params.id,
      },
      {
        onError: (error) => {
          message.error(error.message);
        },
        onSuccess(data) {
          message.success(data.message);
          mutate();
          setOpen(false);
          form.resetFields();
        },
      },
    );
  };

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Nama Kelas',
      children: classData?.name,
    },
    {
      key: '2',
      label: 'Deskripsi',
      children: classData?.description,
    },
    {
      key: '3',
      label: 'Wali Kelas',
      children: classData?.homeroomTeacher?.name,
    },
    {
      key: '4',
      label: `Siswa (${classData?.students?.length})`,
      children: (
        <div>
          {classData?.students?.map((student) => (
            <Tag color="blue" key={student.id}>
              {student.name}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      key: '5',
      label: 'Mata Pelajaran',
      children: (
        <div>
          {classData?.subjects?.map((subject) => (
            <Tag color="blue" key={subject.id}>
              {subject.name}
            </Tag>
          ))}
        </div>
      ),
    },
  ];
  return (
    <>
      {loadingClassById ? (
        <Skeleton active />
      ) : (
        <div>
          <Descriptions
            title={
              <div>
                <h1 className="mb-6 text-2xl font-extrabold text-gray-800">
                  <Link href="/dashboard/class-page">Kelas</Link> /{' '}
                  {classData?.name}
                </h1>
                <Button
                  className="mb-6"
                  icon={<EditOutlined />}
                  onClick={() => showModalEdit(classData)}
                  type="primary"
                  size="large"
                >
                  Edit Kelas
                </Button>
              </div>
            }
            items={items}
          />
          <div className="mt-6">
            <h2 className="mb-6 text-xl font-extrabold text-gray-800">
              Jadwal Pelajaran
            </h2>
          </div>
        </div>
      )}
      <Modal
        title="Edit Kelas"
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
            loading={loadingUpdateClass}
          >
            Simpan
          </Button>,
        ]}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item<TUpdateClassRequest>
            name="name"
            label="Nama"
            rules={[{ required: true, message: 'Nama harus diisi' }]}
          >
            <Input placeholder="Masukkan nama kelas" />
          </Form.Item>
          <Form.Item name="description" label="Deskripsi">
            <Input placeholder="Masukkan deskripsi kelas" />
          </Form.Item>
          <Form.Item<TUpdateClassRequest>
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
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item<TUpdateClassRequest>
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
                String(option?.label ?? '')
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item name="students" label="Siswa">
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
}

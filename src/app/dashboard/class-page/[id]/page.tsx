'use client';

import { useClassById, useUpdateClass } from '@/hooks/useClass';
import {
  Badge,
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Skeleton,
  Tag,
} from 'antd';
import {
  ArrowLeftOutlined,
  BookOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useContext, use, useState } from 'react';
import { TClass, TUpdateClassRequest } from '@/libs/types/class';
import { useTeacher } from '@/hooks/useTeacher';
import { useSubjects } from '@/hooks/useSubjects';
import SelectComp from '@/components/Select';
import Link from 'next/link';
import { useMessage } from '@/hooks/useMessage';
import { UserContext } from '@/context/UserContext';
import { useSubjectsSchedule } from '@/hooks/useSubjectsSchedule';
import {
  DAY_LABELS,
  TDay,
  TSubjectsSchedule,
} from '@/libs/types/subjectsSchedule';
import dayjs from 'dayjs';

const DAY_ORDER: TDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const DAY_COLORS: Record<TDay, string> = {
  monday: 'blue',
  tuesday: 'cyan',
  wednesday: 'green',
  thursday: 'orange',
  friday: 'purple',
  saturday: 'magenta',
  sunday: 'red',
};

const TIME_FORMAT = 'HH:mm';

export default function Page({
  params,
}: {
  readonly params: Promise<{ readonly id: string }>;
}) {
  const { id } = use(params);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const message = useMessage();
  const { academic } = useContext(UserContext);
  const { classData, mutate, loadingClassById } = useClassById(id);
  const { updateClass, loadingUpdateClass } = useUpdateClass();
  const { teachers, loadingTeachers } = useTeacher();
  const { subjects, loadingSubjects } = useSubjects();
  const { subjectsSchedule, loadingSubjectsSchedule } = useSubjectsSchedule(
    academic?.id,
  );

  const classSchedule: TSubjectsSchedule[] = (subjectsSchedule ?? []).filter(
    (s) => s.class?.id === id,
  );

  const scheduleByDay = DAY_ORDER.reduce(
    (acc, day) => {
      acc[day] = classSchedule.filter((s) => s.day === day);
      return acc;
    },
    {} as Record<TDay, TSubjectsSchedule[]>,
  );

  const showModalEdit = (data?: TClass) => {
    setOpen(true);
    if (data) {
      form.setFieldsValue({
        name: data.name,
        description: data.description,
        homeroomTeacherId: data.homeroomTeacherId,
        subjects: data.subjects?.map((item) => item.id),
      });
    } else {
      form.resetFields();
    }
  };

  const handleOk = () => form.submit();
  const handleCancel = () => setOpen(false);

  const onFinish = (values: TUpdateClassRequest) => {
    const filteredValue = Object.fromEntries(
      Object.entries(values).filter(
        ([, value]) => value !== null && value !== '',
      ),
    );
    updateClass(
      { ...filteredValue, id: id },
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

  if (loadingClassById) {
    return (
      <div className="space-y-6">
        <Skeleton active paragraph={{ rows: 2 }} />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </div>
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb + Edit button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link
            href="/dashboard/class-page"
            className="flex items-center gap-1 font-medium text-blue-600 hover:underline"
          >
            <ArrowLeftOutlined /> Kelas
          </Link>
          <span>/</span>
          <span className="font-semibold text-gray-800">{classData?.name}</span>
        </div>
        <Button
          icon={<EditOutlined />}
          onClick={() => showModalEdit(classData)}
          type="primary"
          className="rounded-xl"
        >
          Edit Kelas
        </Button>
      </div>

      {/* Hero banner */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-linear-to-r from-blue-800 to-blue-500 shadow-lg">
        <div className="px-8 py-6">
          <div className="mb-1 flex items-center gap-2">
            <BookOutlined className="text-white/70" />
            <span className="text-xs font-semibold tracking-wider text-white/70 uppercase">
              Detail Kelas
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            {classData?.name}
          </h1>
          {classData?.description && (
            <p className="mt-2 text-blue-100">{classData.description}</p>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
            <UserOutlined className="text-xl text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400">Wali Kelas</p>
            <p className="truncate font-semibold text-gray-800">
              {classData?.homeroomTeacher?.name ?? '-'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100">
            <BookOutlined className="text-xl text-teal-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Mata Pelajaran</p>
            <p className="text-2xl font-extrabold text-gray-800">
              {classData?.subjects?.length ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Subjects - compact full-width */}
      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-700">
          <BookOutlined className="text-teal-500" />
          Mata Pelajaran
          <Badge
            count={classData?.subjects?.length ?? 0}
            color="cyan"
            showZero
          />
        </h3>
        {(classData?.subjects?.length ?? 0) === 0 ? (
          <Empty
            description="Belum ada mata pelajaran"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {classData?.subjects?.map((s) => (
              <Tag
                key={s.id}
                color="cyan"
                className="m-0 rounded-full px-3 py-0.5 text-sm"
              >
                {s.name}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {/* Schedule - full-width */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-700">
          <CalendarOutlined className="text-purple-500" />
          Jadwal Pelajaran
          <Badge count={classSchedule.length} color="purple" showZero />
        </h3>

        {loadingSubjectsSchedule ? (
          <Skeleton active />
        ) : classSchedule.length === 0 ? (
          <Empty
            description={
              academic?.id
                ? 'Belum ada jadwal untuk kelas ini'
                : 'Pilih kalender akademik terlebih dahulu'
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div className="space-y-6">
            {DAY_ORDER.filter((day) => scheduleByDay[day].length > 0).map(
              (day) => (
                <div key={day}>
                  <div className="mb-3 flex items-center gap-3">
                    <Tag
                      color={DAY_COLORS[day]}
                      className="rounded-full text-sm font-semibold"
                    >
                      {DAY_LABELS[day]}
                    </Tag>
                    <span className="text-sm text-gray-400">
                      {scheduleByDay[day].length} jadwal
                    </span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                    {scheduleByDay[day].map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                      >
                        <ClockCircleOutlined className="shrink-0 text-gray-400" />
                        <span className="w-24 shrink-0 font-mono text-sm font-semibold text-gray-700">
                          {dayjs(s.startTime).format(TIME_FORMAT)}
                          {' – '}
                          {dayjs(s.endTime).format(TIME_FORMAT)}
                        </span>
                        <Tag color="blue" className="m-0 shrink-0">
                          {s.subject?.name}
                        </Tag>
                        {s.teacher && (
                          <span className="truncate text-sm text-gray-500">
                            <UserOutlined className="mr-1" />
                            {s.teacher.name}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
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

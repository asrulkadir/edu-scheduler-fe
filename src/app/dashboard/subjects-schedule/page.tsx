'use client';

import {
  Button,
  Empty,
  Form,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Tag,
  TimePicker,
  Tooltip,
} from 'antd';
import { useMessage } from '@/hooks/useMessage';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BookOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import {
  useSubjectsSchedule,
  useCreateSubjectsSchedule,
  useUpdateSubjectsSchedule,
  useDeleteSubjectsSchedule,
} from '@/hooks/useSubjectsSchedule';
import { useSubjects } from '@/hooks/useSubjects';
import { useClass } from '@/hooks/useClass';
import { useTeacher } from '@/hooks/useTeacher';
import { useContext, useState } from 'react';
import { useQueryState } from 'nuqs';
import {
  DAY_LABELS,
  TCreateSubjectsScheduleRequest,
  TDay,
  TSubjectsSchedule,
  TUpdateSubjectsScheduleRequest,
} from '@/libs/types/subjectsSchedule';
import { UserContext } from '@/context/UserContext';
import { ERole } from '@/libs/utils/enum';
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

const DAY_OPTIONS: { value: TDay; label: string }[] = [
  { value: 'monday', label: 'Senin' },
  { value: 'tuesday', label: 'Selasa' },
  { value: 'wednesday', label: 'Rabu' },
  { value: 'thursday', label: 'Kamis' },
  { value: 'friday', label: 'Jumat' },
  { value: 'saturday', label: 'Sabtu' },
  { value: 'sunday', label: 'Minggu' },
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

const DAY_BG: Record<TDay, string> = {
  monday: '#EFF6FF',
  tuesday: '#ECFEFF',
  wednesday: '#F0FDF4',
  thursday: '#FFF7ED',
  friday: '#FAF5FF',
  saturday: '#FFF0F6',
  sunday: '#FFF1F0',
};

const DAY_BORDER: Record<TDay, string> = {
  monday: '#BFDBFE',
  tuesday: '#A5F3FC',
  wednesday: '#A7F3D0',
  thursday: '#FED7AA',
  friday: '#DDD6FE',
  saturday: '#F9A8D4',
  sunday: '#FCA5A5',
};

const TIME_FORMAT = 'HH:mm';

const Page = () => {
  const message = useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [keyEdit, setKeyEdit] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null,
  );
  const [filterSubjectId, setFilterSubjectId] = useQueryState('subjectId');
  const [filterTeacherId, setFilterTeacherId] = useQueryState('teacherId');
  const [filterClassId, setFilterClassId] = useQueryState('classId');
  const { user, academic } = useContext(UserContext);

  const canManage = user.role === ERole.ADMIN || user.role === ERole.SUPERADMIN;

  const { subjectsSchedule, loadingSubjectsSchedule, mutateSubjectsSchedule } =
    useSubjectsSchedule(academic?.id, {
      subjectId: filterSubjectId,
      teacherId: filterTeacherId,
      classId: filterClassId,
    });
  const { createSubjectsSchedule, loadingCreateSubjectsSchedule } =
    useCreateSubjectsSchedule();
  const { updateSubjectsSchedule, loadingUpdateSubjectsSchedule } =
    useUpdateSubjectsSchedule();
  const { deleteSubjectsSchedule } = useDeleteSubjectsSchedule();

  const { subjects, loadingSubjects } = useSubjects();
  const { classesData, loadingClass } = useClass();
  const { teachers, loadingTeachers } = useTeacher();

  const filteredTeachers = selectedSubjectId
    ? (subjects?.find((s) => s.id === selectedSubjectId)?.teacher ?? [])
    : [];

  const hasActiveFilter = !!(
    filterSubjectId ||
    filterTeacherId ||
    filterClassId
  );

  const scheduleByDay = DAY_ORDER.reduce(
    (acc, day) => {
      acc[day] = (subjectsSchedule ?? []).filter((s) => s.day === day);
      return acc;
    },
    {} as Record<TDay, TSubjectsSchedule[]>,
  );

  const daysWithSchedule = DAY_ORDER.filter((d) => scheduleByDay[d].length > 0);

  const showModalAddEdit = (editId: string, data?: TSubjectsSchedule) => {
    setOpen(true);
    setKeyEdit(editId);
    if (data) {
      form.setFieldsValue({
        subjectId: data.subject?.id,
        classId: data.class?.id,
        day: data.day,
        startTime: data.startTime ? dayjs(data.startTime) : null,
        endTime: data.endTime ? dayjs(data.endTime) : null,
        academicCalendarId: academic?.id,
        takenByTeacher: data.teacher?.id,
      });
      setSelectedSubjectId(data.subject?.id ?? null);
    } else {
      form.resetFields();
      setSelectedSubjectId(null);
    }
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setSelectedSubjectId(null);
  };

  const onFinish = (
    values: TCreateSubjectsScheduleRequest & {
      startTime: dayjs.Dayjs;
      endTime: dayjs.Dayjs;
    },
  ) => {
    const payload = {
      ...values,
      startTime: values.startTime ? values.startTime.toISOString() : undefined,
      endTime: values.endTime ? values.endTime.toISOString() : undefined,
      academicCalendarId: academic?.id,
    };

    if (keyEdit) {
      const filteredValue = Object.fromEntries(
        Object.entries(payload).filter(
          ([, value]) => value !== null && value !== undefined && value !== '',
        ),
      ) as TUpdateSubjectsScheduleRequest;

      updateSubjectsSchedule(
        { ...filteredValue, id: keyEdit },
        {
          onError: (error) => {
            message.error(error.message);
          },
          onSuccess(data) {
            message.success(data.message);
            mutateSubjectsSchedule();
            setOpen(false);
            form.resetFields();
          },
        },
      );
    } else {
      createSubjectsSchedule(payload as TCreateSubjectsScheduleRequest, {
        onError: (error) => {
          message.error(error.message);
        },
        onSuccess(data) {
          message.success(data.message);
          mutateSubjectsSchedule();
          setOpen(false);
          form.resetFields();
        },
      });
    }
  };

  const onDelete = (id: string) => {
    deleteSubjectsSchedule(
      { id },
      {
        onError: (error) => {
          message.error(error.message);
        },
        onSuccess(data) {
          message.success(data.message);
          mutateSubjectsSchedule();
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
            Jadwal Mata Pelajaran
          </h1>
          <p className="text-sm text-gray-500">
            {subjectsSchedule?.length ?? 0} jadwal
            {hasActiveFilter ? ' (difilter)' : ' terdaftar'}
          </p>
        </div>
        {canManage && (
          <Button
            icon={<PlusOutlined />}
            onClick={() => showModalAddEdit('')}
            type="primary"
            size="large"
            className="rounded-xl"
          >
            Tambah Jadwal
          </Button>
        )}
      </div>

      {/* Filter bar */}
      {!!academic?.id && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Select
            allowClear
            placeholder="Filter Mata Pelajaran"
            loading={loadingSubjects}
            value={filterSubjectId ?? undefined}
            onChange={(val) => setFilterSubjectId(val ?? null)}
            options={subjects?.map((s) => ({ value: s.id, label: s.name }))}
            showSearch={{
              filterOption: (input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()),
            }}
            className="min-w-48"
          />
          <Select
            allowClear
            placeholder="Filter Guru"
            loading={loadingTeachers}
            value={filterTeacherId ?? undefined}
            onChange={(val) => setFilterTeacherId(val ?? null)}
            options={teachers?.map((t) => ({ value: t.id, label: t.name }))}
            showSearch={{
              filterOption: (input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()),
            }}
            className="min-w-48"
          />
          <Select
            allowClear
            placeholder="Filter Kelas"
            loading={loadingClass}
            value={filterClassId ?? undefined}
            onChange={(val) => setFilterClassId(val ?? null)}
            options={classesData?.map((c) => ({ value: c.id, label: c.name }))}
            showSearch={{
              filterOption: (input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()),
            }}
            className="min-w-40"
          />
          {hasActiveFilter && (
            <Button
              size="small"
              onClick={() => {
                setFilterSubjectId(null);
                setFilterTeacherId(null);
                setFilterClassId(null);
              }}
            >
              Reset Filter
            </Button>
          )}
        </div>
      )}

      {/* Day summary pills */}
      {!loadingSubjectsSchedule && (subjectsSchedule?.length ?? 0) > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {DAY_ORDER.map((day) => {
            const count = scheduleByDay[day].length;
            if (!count) return null;
            return (
              <Tag
                key={day}
                color={DAY_COLORS[day]}
                className="rounded-full px-3 py-0.5 text-sm font-semibold"
              >
                {DAY_LABELS[day]} · {count}
              </Tag>
            );
          })}
        </div>
      )}

      {/* Content */}
      {loadingSubjectsSchedule ? (
        <div className="space-y-4">
          <Skeleton active />
          <Skeleton active />
        </div>
      ) : hasActiveFilter && (subjectsSchedule?.length ?? 0) === 0 ? (
        <Empty description="Tidak ada jadwal yang sesuai filter" />
      ) : (subjectsSchedule?.length ?? 0) === 0 ? (
        <Empty
          description={
            academic?.id
              ? 'Belum ada jadwal'
              : 'Pilih kalender akademik terlebih dahulu'
          }
        />
      ) : (
        <div className="space-y-8">
          {daysWithSchedule.map((day) => (
            <div key={day}>
              {/* Day header */}
              <div className="mb-3 flex items-center gap-3">
                <Tag
                  color={DAY_COLORS[day]}
                  className="rounded-full px-4 py-1 text-sm font-bold"
                >
                  {DAY_LABELS[day]}
                </Tag>
                <span className="text-sm text-gray-400">
                  {scheduleByDay[day].length} jadwal
                </span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>

              {/* Schedule cards */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {scheduleByDay[day].map((item) => (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      background: DAY_BG[day],
                      borderColor: DAY_BORDER[day],
                    }}
                  >
                    {/* Time */}
                    <div className="mb-3 flex items-center gap-2">
                      <ClockCircleOutlined className="text-gray-400" />
                      <span className="font-mono text-sm font-bold text-gray-700">
                        {dayjs(item.startTime).format(TIME_FORMAT)}
                        {' – '}
                        {dayjs(item.endTime).format(TIME_FORMAT)}
                      </span>
                    </div>

                    {/* Subject */}
                    <div className="mb-1.5 flex items-center gap-2">
                      <BookOutlined className="shrink-0 text-blue-400" />
                      <span className="font-semibold text-gray-800">
                        {item.subject?.name}
                      </span>
                    </div>

                    {/* Class */}
                    <div className="mb-1.5 flex items-center gap-2">
                      <HomeOutlined className="shrink-0 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {item.class?.name}
                      </span>
                    </div>

                    {/* Teacher */}
                    {item.teacher && (
                      <div className="flex items-center gap-2">
                        <UserOutlined className="shrink-0 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {item.teacher.name}
                        </span>
                      </div>
                    )}

                    {/* Action buttons */}
                    {canManage && (
                      <div className="absolute top-3 right-3 flex gap-1">
                        <Tooltip title="Edit">
                          <Button
                            size="small"
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => showModalAddEdit(item.id, item)}
                          />
                        </Tooltip>
                        <Tooltip title="Hapus">
                          <Popconfirm
                            title="Yakin ingin menghapus jadwal ini?"
                            onConfirm={() => onDelete(item.id)}
                            okText="Hapus"
                            cancelText="Batal"
                            okButtonProps={{ danger: true }}
                          >
                            <Button
                              size="small"
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                            />
                          </Popconfirm>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={
          keyEdit
            ? 'Edit Jadwal Mata Pelajaran'
            : 'Tambah Jadwal Mata Pelajaran'
        }
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
            loading={
              loadingCreateSubjectsSchedule || loadingUpdateSubjectsSchedule
            }
          >
            Simpan
          </Button>,
        ]}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="subjectId"
            label="Mata Pelajaran"
            rules={[
              { required: true, message: 'Mata pelajaran harus dipilih' },
            ]}
          >
            <Select
              options={subjects?.map((s) => ({ value: s.id, label: s.name }))}
              placeholder="Pilih mata pelajaran"
              loading={loadingSubjects}
              onChange={(value) => {
                setSelectedSubjectId(value);
                form.setFieldValue('takenByTeacher', undefined);
              }}
              showSearch={{
                filterOption: (input, option) =>
                  String(option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase()),
              }}
            />
          </Form.Item>

          <Form.Item
            name="classId"
            label="Kelas"
            rules={[{ required: true, message: 'Kelas harus dipilih' }]}
          >
            <Select
              options={classesData?.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              placeholder="Pilih kelas"
              loading={loadingClass}
              showSearch={{
                filterOption: (input, option) =>
                  String(option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase()),
              }}
            />
          </Form.Item>

          <Form.Item
            name="day"
            label="Hari"
            rules={[{ required: true, message: 'Hari harus dipilih' }]}
          >
            <Select options={DAY_OPTIONS} placeholder="Pilih hari" />
          </Form.Item>

          <Form.Item
            name="startTime"
            label="Jam Mulai"
            rules={[{ required: true, message: 'Jam mulai harus diisi' }]}
          >
            <TimePicker format={TIME_FORMAT} className="w-full" />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="Jam Selesai"
            rules={[{ required: true, message: 'Jam selesai harus diisi' }]}
          >
            <TimePicker format={TIME_FORMAT} className="w-full" />
          </Form.Item>

          <Form.Item name="takenByTeacher" label="Guru (opsional)">
            <Select
              options={filteredTeachers.map((t) => ({
                value: t.id,
                label: t.name,
              }))}
              placeholder={
                selectedSubjectId
                  ? 'Pilih guru'
                  : 'Pilih mata pelajaran terlebih dahulu'
              }
              disabled={!selectedSubjectId}
              showSearch={{
                filterOption: (input, option) =>
                  String(option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase()),
              }}
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Page;

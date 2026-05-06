'use client';

import {
  Button,
  Form,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Table,
  TimePicker,
  Tooltip,
} from 'antd';
import { useMessage } from '@/hooks/useMessage';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  useSubjectsSchedule,
  useCreateSubjectsSchedule,
  useUpdateSubjectsSchedule,
  useDeleteSubjectsSchedule,
} from '@/hooks/useSubjectsSchedule';
import { useSubjects } from '@/hooks/useSubjects';
import { useClass } from '@/hooks/useClass';
import { useContext, useState } from 'react';
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

const DAY_OPTIONS: { value: TDay; label: string }[] = [
  { value: 'monday', label: 'Senin' },
  { value: 'tuesday', label: 'Selasa' },
  { value: 'wednesday', label: 'Rabu' },
  { value: 'thursday', label: 'Kamis' },
  { value: 'friday', label: 'Jumat' },
  { value: 'saturday', label: 'Sabtu' },
  { value: 'sunday', label: 'Minggu' },
];

const TIME_FORMAT = 'HH:mm';

const Page = () => {
  const message = useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [keyEdit, setKeyEdit] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null,
  );
  const { user, academic } = useContext(UserContext);

  const canManage = user.role === ERole.ADMIN || user.role === ERole.SUPERADMIN;

  const { subjectsSchedule, loadingSubjectsSchedule, mutateSubjectsSchedule } =
    useSubjectsSchedule(academic?.id);
  const { createSubjectsSchedule, loadingCreateSubjectsSchedule } =
    useCreateSubjectsSchedule();
  const { updateSubjectsSchedule, loadingUpdateSubjectsSchedule } =
    useUpdateSubjectsSchedule();
  const { deleteSubjectsSchedule } = useDeleteSubjectsSchedule();

  const { subjects, loadingSubjects } = useSubjects();
  const { classesData, loadingClass } = useClass();

  const filteredTeachers = selectedSubjectId
    ? (subjects?.find((s) => s.id === selectedSubjectId)?.teacher ?? [])
    : [];

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

  const columns = [
    {
      title: 'Mata Pelajaran',
      dataIndex: ['subject', 'name'],
      key: 'subject',
    },
    {
      title: 'Kelas',
      dataIndex: ['class', 'name'],
      key: 'class',
    },
    {
      title: 'Hari',
      dataIndex: 'day',
      key: 'day',
      render: (day: TDay) => DAY_LABELS[day] ?? day,
    },
    {
      title: 'Jam Mulai',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time: string) => (time ? dayjs(time).format(TIME_FORMAT) : '-'),
    },
    {
      title: 'Jam Selesai',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (time: string) => (time ? dayjs(time).format(TIME_FORMAT) : '-'),
    },
    {
      title: 'Guru',
      dataIndex: ['teacher', 'name'],
      key: 'teacher',
      render: (name: string) => name ?? '-',
    },
    {
      title: 'Tahun Akademik',
      dataIndex: ['academicCalendar', 'name'],
      key: 'academicCalendar',
    },
    ...(canManage
      ? [
          {
            title: 'Aksi',
            key: 'action',
            render: (_: unknown, record: TSubjectsSchedule) => (
              <div className="flex gap-2">
                <Tooltip title="Edit">
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => showModalAddEdit(record.id, record)}
                  />
                </Tooltip>
                <Tooltip title="Hapus">
                  <Popconfirm
                    title="Yakin ingin menghapus jadwal ini?"
                    onConfirm={() => onDelete(record.id)}
                    okText="Ya"
                    cancelText="Tidak"
                  >
                    <Button type="link" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Tooltip>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <div>
        <h1 className="mb-6 text-2xl font-extrabold text-gray-800">
          Jadwal Mata Pelajaran
        </h1>
        {canManage && (
          <Button
            className="mb-6"
            icon={<PlusOutlined />}
            onClick={() => showModalAddEdit('')}
            type="primary"
            size="large"
          >
            Tambah Jadwal
          </Button>
        )}
        {loadingSubjectsSchedule ? (
          <Spin />
        ) : (
          <Table
            dataSource={subjectsSchedule ?? []}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
          />
        )}
      </div>

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

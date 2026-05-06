'use client';

import { useContext, useState } from 'react';
import {
  Button,
  DatePicker,
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
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import {
  TAcademicCalendar,
  TCreateAcademicCalendarRequest,
} from '@/libs/types/academicCalendar';
import {
  useAcademicCalendars,
  useCreateAcademicCalendar,
  useDeleteAcademicCalendar,
  useUpdateAcademicCalendar,
} from '@/hooks/useAcademicCalendar';
import { UserContext } from '@/context/UserContext';
import { ERole } from '@/libs/utils/enum';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Page = () => {
  const message = useMessage();
  const { user, mutateCurrentAcademic } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState('');
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const { academicCalendars, loadingAcademicCalendars, mutate } =
    useAcademicCalendars();
  const { updateAcademicCalendar, loadingUpdateAcademicCalendar } =
    useUpdateAcademicCalendar();
  const { createAcademicCalendar, loadingCreateAcademicCalendar } =
    useCreateAcademicCalendar();
  const { deleteAcademicCalendar } = useDeleteAcademicCalendar();

  const data = academicCalendars ?? [];
  const canManage = user?.role === ERole.SUPERADMIN;

  const showModalEdit = (item: TAcademicCalendar) => {
    setEditId(item.id);
    editForm.setFieldsValue({
      name: item.name,
      range: [dayjs(item.startTime), dayjs(item.endTime)],
    });
    setOpenEdit(true);
  };

  const handleDelete = (id: string) => {
    deleteAcademicCalendar(
      { id },
      {
        onError: (error) => {
          message.error(error.message);
        },
        onSuccess(data) {
          message.success(data.message);
          mutate();
          mutateCurrentAcademic();
        },
      },
    );
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const handleEditOk = () => {
    editForm.submit();
  };

  const handleEditCancel = () => {
    setOpenEdit(false);
    editForm.resetFields();
  };

  const onFinish = (values: TCreateAcademicCalendarRequest) => {
    createAcademicCalendar(
      {
        name: values.name,
        startTime: values.range?.[0] ?? '',
        endTime: values.range?.[1] ?? '',
      },
      {
        onError: (error) => {
          message.error(error.message);
        },
        onSuccess(data) {
          message.success(data.message);
          mutate();
          mutateCurrentAcademic();
          setOpen(false);
          form.resetFields();
        },
      },
    );
  };

  const onFinishEdit = (values: TCreateAcademicCalendarRequest) => {
    updateAcademicCalendar(
      {
        id: editId,
        name: values.name,
        startTime: values.range?.[0] ?? '',
        endTime: values.range?.[1] ?? '',
      },
      {
        onError: (error) => {
          message.error(error.message);
        },
        onSuccess(data) {
          message.success(data.message);
          mutate();
          mutateCurrentAcademic();
          setOpenEdit(false);
          editForm.resetFields();
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
            Kalender Akademik
          </h1>
          <p className="text-sm text-gray-500">
            {data.length} kalender terdaftar
          </p>
        </div>
        {canManage && (
          <Button
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
            type="primary"
            size="large"
            className="rounded-xl"
          >
            Tambah Kalender
          </Button>
        )}
      </div>

      {/* Cards */}
      {loadingAcademicCalendars ? (
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
      ) : data.length === 0 ? (
        <Empty description="Belum ada kalender akademik" />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => {
            const start = dayjs(item.startTime);
            const end = dayjs(item.endTime);
            const now = dayjs();
            const totalDays = end.diff(start, 'day');
            const elapsedDays = now.diff(start, 'day');
            const progress = Math.min(
              100,
              Math.max(0, Math.round((elapsedDays / totalDays) * 100)),
            );
            const isActive = now.isAfter(start) && now.isBefore(end);
            const isEnded = now.isAfter(end);

            return (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                {/* Card header */}
                <div className="flex items-start justify-between px-5 py-4">
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="mb-1 flex items-center gap-2">
                      <CalendarOutlined />
                      <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                        Kalender Akademik
                      </span>
                    </div>
                    <h2 className="line-clamp-2 text-xl leading-tight font-bold text-gray-800">
                      {item.name}
                    </h2>
                  </div>
                  {canManage && (
                    <div className="flex shrink-0 gap-1">
                      <Tooltip title="Edit">
                        <button
                          onClick={() => showModalEdit(item)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-500 transition hover:bg-blue-500/80"
                        >
                          <EditOutlined />
                        </button>
                      </Tooltip>
                      <Tooltip title="Hapus">
                        <Popconfirm
                          title="Yakin ingin hapus kalender ini?"
                          onConfirm={() => handleDelete(item.id)}
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
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-4 px-5 pb-5">
                  {/* Date range */}
                  <div className="grid grid-cols-2 divide-x divide-gray-100 rounded-xl border border-gray-100 bg-gray-50">
                    <div className="flex flex-col items-center py-3">
                      <span className="text-xs text-gray-400">Mulai</span>
                      <span className="mt-1 text-sm font-bold text-gray-700">
                        {start.format('DD MMM YYYY')}
                      </span>
                    </div>
                    <div className="flex flex-col items-center py-3">
                      <span className="text-xs text-gray-400">Selesai</span>
                      <span className="mt-1 text-sm font-bold text-gray-700">
                        {end.format('DD MMM YYYY')}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {isEnded
                          ? 'Selesai'
                          : isActive
                            ? `${progress}% berjalan`
                            : 'Belum dimulai'}
                      </span>
                      <span>{totalDays} hari</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${progress}%`,
                          background: isEnded
                            ? '#9CA3AF'
                            : isActive
                              ? '#3B82F6'
                              : '#D1D5DB',
                        }}
                      />
                    </div>
                  </div>

                  {/* Status tag */}
                  <div>
                    {isEnded ? (
                      <Tag color="default" className="rounded-full">
                        Selesai
                      </Tag>
                    ) : isActive ? (
                      <Tag color="green" className="rounded-full">
                        Aktif
                      </Tag>
                    ) : (
                      <Tag color="orange" className="rounded-full">
                        Akan Datang
                      </Tag>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create modal */}
      <Modal
        title="Tambah Kalender Akademik"
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
            loading={loadingCreateAcademicCalendar}
          >
            Simpan
          </Button>,
        ]}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item<TCreateAcademicCalendarRequest>
            name="name"
            label="Nama"
            rules={[{ required: true, message: 'Nama harus diisi' }]}
          >
            <Input placeholder="Masukkan nama kalender akademik" />
          </Form.Item>
          <Form.Item
            name="range"
            label="Rentang Waktu"
            rules={[{ required: true, message: 'Rentang waktu harus diisi' }]}
          >
            <RangePicker
              format="DD/MM/YYYY"
              className="w-full"
              placeholder={['Tanggal Mulai', 'Tanggal Selesai']}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit modal */}
      <Modal
        title="Edit Kalender Akademik"
        open={openEdit}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        footer={[
          <Button key="back" onClick={handleEditCancel}>
            Batal
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleEditOk}
            loading={loadingUpdateAcademicCalendar}
          >
            Simpan
          </Button>,
        ]}
      >
        <Form form={editForm} onFinish={onFinishEdit} layout="vertical">
          <Form.Item<TCreateAcademicCalendarRequest>
            name="name"
            label="Nama"
            rules={[{ required: true, message: 'Nama harus diisi' }]}
          >
            <Input placeholder="Masukkan nama kalender akademik" />
          </Form.Item>
          <Form.Item
            name="range"
            label="Rentang Waktu"
            rules={[{ required: true, message: 'Rentang waktu harus diisi' }]}
          >
            <RangePicker
              format="DD/MM/YYYY"
              className="w-full"
              placeholder={['Tanggal Mulai', 'Tanggal Selesai']}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Page;

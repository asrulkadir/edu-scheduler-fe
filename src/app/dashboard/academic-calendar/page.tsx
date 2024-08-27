'use client';

import { useContext, useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  TableColumnProps,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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
import EditableTable from '@/components/EditableTable';
import { UserContext } from '@/context/UserContext';
import { ERole } from '@/libs/utils/enum';
import dayjs from 'dayjs';
import { getDifferences } from '@/libs/utils/helpers';

const { RangePicker } = DatePicker;

const Page = () => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { mutateCurrentAcademic } = useContext(UserContext);

  const { academicCalendars, loadingAcademicCalendars, mutate } =
    useAcademicCalendars();
  const { updateAcademicCalendar, loadingUpdateAcademicCalendar } =
    useUpdateAcademicCalendar();
  const { createAcademicCalendar, loadingCreateAcademicCalendar } =
    useCreateAcademicCalendar();
  const { deleteAcademicCalendar, loadingDeleteAcademicCalendar } =
    useDeleteAcademicCalendar();

  const [data, setData] = useState<TAcademicCalendar[]>([]);

  useEffect(() => {
    if (academicCalendars) {
      setData(academicCalendars);
    }
  }, [academicCalendars]);

  const showModal = () => {
    setOpen(true);
  };

  const columns: (TableColumnProps<TAcademicCalendar> & {
    editable?: boolean;
    inputType?: 'text' | 'date';
  })[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Tanggal Mulai',
      dataIndex: 'startTime',
      key: 'startTime',
      editable: true,
      inputType: 'date',
      render: (text) => dayjs(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Tanggal Selesai',
      dataIndex: 'endTime',
      key: 'endTime',
      editable: true,
      inputType: 'date',
      render: (text) => dayjs(text).format('DD/MM/YYYY'),
    },
  ];

  const handleSave = async (key: React.Key, row: TAcademicCalendar) => {
    const newData = {
      ...row,
      id: key.toString(),
    };
    const previousData = data.find((item) => item.id === key);

    const diff = getDifferences<TAcademicCalendar>(newData, previousData);

    await updateAcademicCalendar(
      { id: key.toString(), ...diff },
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

  const handleDelete = async (key: React.Key) => {
    await deleteAcademicCalendar(
      { id: key.toString() },
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
        },
      },
    );
  };

  return (
    <>
      <div>
        <h1 className="mb-4 text-2xl font-bold">Daftar Kalender Akademik</h1>
        <Button
          className="mb-4"
          icon={<PlusOutlined />}
          onClick={showModal}
          type="primary"
        >
          Tambah Calendar Akademik
        </Button>
        <EditableTable<TAcademicCalendar>
          data={data}
          columns={columns}
          onSave={handleSave}
          onDelete={handleDelete}
          loading={
            loadingAcademicCalendars ||
            loadingUpdateAcademicCalendar ||
            loadingDeleteAcademicCalendar
          }
          editable={user?.role === ERole.SUPERADMIN}
          deletable={user?.role === ERole.SUPERADMIN}
        />
      </div>
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
          {/* <Form.Item<TCreateAcademicCalendarRequest>
            name="startTime"
            label="Tanggal Mulai"
            rules={[{ required: true, message: 'Tanggal mulai harus diisi' }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item<TCreateAcademicCalendarRequest>
            name="endTime"
            label="Tanggal Selesai"
            rules={[{ required: true, message: 'Tanggal selesai harus diisi' }]}
          >
            <DatePicker />
          </Form.Item> */}
          <Form.Item
            name="range"
            label="Rentang Waktu Kalender Akademik"
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

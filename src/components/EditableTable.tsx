import { TNameId } from '@/libs/types/common';
import { EGender, ERole } from '@/libs/utils/enum';
import {
  DatePicker,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { TableColumnProps, TableProps } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

interface EditableCellProps<T> extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: never;
  inputType:
    | 'number'
    | 'text'
    | 'role'
    | 'date'
    | 'gender'
    | 'customSelectMultiple';
  record: T;
  index: number;
  dataSelect?: TNameId[];
}

const EditableCell = <T extends object>({
  editing,
  dataIndex,
  title,
  inputType,
  dataSelect,
  children,
  ...restProps
}: EditableCellProps<T>) => {
  const inputNode = {
    number: <Input type="number" />,
    text: <Input />,
    role: (
      <Select>
        <Select.Option value={ERole.ADMIN}>{ERole.ADMIN}</Select.Option>
        <Select.Option value={ERole.TEACHER}>{ERole.TEACHER}</Select.Option>
        <Select.Option value={ERole.STUDENT}>{ERole.STUDENT}</Select.Option>
      </Select>
    ),
    date: <DatePicker format="DD/MM/YYYY" />,
    gender: (
      <Select>
        <Select.Option value={EGender.male}>Laki-laki</Select.Option>
        <Select.Option value={EGender.female}>Perempuan</Select.Option>
      </Select>
    ),
    customSelectMultiple: (
      <Select
        mode="multiple"
        tagRender={(props) => {
          const { label, closable, onClose } = props;
          return (
            <Tag color="blue" closable={closable} onClose={onClose}>
              {label}
            </Tag>
          );
        }}
        showSearch
        filterOption={(input, option) =>
          String(option?.label ?? '')
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        options={dataSelect?.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
      />
    ),
    customSelect: (
      <Select
        tagRender={(props) => {
          const { label, closable, onClose } = props;
          return (
            <Tag color="blue" closable={closable} onClose={onClose}>
              {label}
            </Tag>
          );
        }}
        showSearch
        filterOption={(input, option) =>
          String(option?.label ?? '')
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        options={dataSelect?.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
      />
    ),
  };

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode[inputType]}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface EditableTableProps<T> extends TableProps<T> {
  data: T[];
  columns: Array<
    TableColumnProps<T> & {
      editable?: boolean;
      inputType?: string;
      dataSelect?: TNameId[];
    }
  >;
  onSave: (key: React.Key, row: T) => Promise<void>;
  onDelete: (key: React.Key) => void;
  editable?: boolean;
  deletable?: boolean;
}

const EditableTable = <T extends { id: React.Key }>({
  data,
  columns,
  onSave,
  onDelete,
  editable,
  deletable,
  ...restProps
}: EditableTableProps<T>) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<React.Key>('');

  const isEditing = (record: T) => record.id === editingKey;

  const edit = (
    record: Partial<T> & {
      id: React.Key;
      startTime?: string;
      endTime?: string;
      subjects?: TNameId[];
    },
  ) => {
    form.setFieldsValue({
      ...record,
      startTime: dayjs(record.startTime),
      endTime: dayjs(record.endTime),
      subjects: record.subjects?.map((subject) => subject.id),
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key | string) => {
    try {
      const row = (await form.validateFields()) as T;
      await onSave(key, row);
      setEditingKey('');
    } catch {
      message.error('Terjadi kesalahan saat menyimpan data');
    }
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: T) => ({
        record,
        inputType: col.inputType || 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        dataSelect: col.dataSelect,
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        rowKey={(record) => record.id as string}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={
          [
            ...mergedColumns,
            ...(editable || deletable
              ? [
                  {
                    title: 'Aksi',
                    dataIndex: 'id',
                    fixed: 'right',
                    render: (_: unknown, record: T) => {
                      const isEditable = isEditing(record);
                      return isEditable ? (
                        <span>
                          <Typography.Link
                            onClick={() => save(record.id)}
                            style={{ marginRight: 8 }}
                          >
                            Simpan
                          </Typography.Link>
                          <Popconfirm
                            title="Yakin ingin batal?"
                            onConfirm={cancel}
                            okText="Ya"
                            cancelText="Tidak"
                          >
                            <Typography.Link type="danger">
                              Batal
                            </Typography.Link>
                          </Popconfirm>
                        </span>
                      ) : (
                        <div className="flex gap-5">
                          {editable && (
                            <Typography.Link
                              disabled={editingKey !== ''}
                              onClick={() => edit(record)}
                            >
                              Edit
                            </Typography.Link>
                          )}
                          {deletable && (
                            <Popconfirm
                              title="Yakin ingin hapus?"
                              onConfirm={() => onDelete(record.id)}
                              okText="Ya"
                              cancelText="Tidak"
                            >
                              <Typography.Link
                                disabled={editingKey !== ''}
                                type="danger"
                              >
                                Hapus
                              </Typography.Link>
                            </Popconfirm>
                          )}
                        </div>
                      );
                    },
                  },
                ]
              : []),
          ] as Array<TableColumnProps<T> & { editable?: boolean }>
        }
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        {...restProps}
      />
    </Form>
  );
};

export default EditableTable;

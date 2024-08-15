import { ERole } from '@/libs/utils/enum';
import { Form, Input, Popconfirm, Select, Table, Typography } from 'antd';
import type { TableColumnProps, TableProps } from 'antd';
import React, { useState } from 'react';

interface EditableCellProps<T> extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: never;
  inputType: 'number' | 'text' | 'select';
  record: T;
  index: number;
}

const EditableCell = <T extends object>({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}: EditableCellProps<T>) => {
  const inputNode =
    inputType === 'select' ? (
      <Select
        options={[
          { value: ERole.ADMIN, label: ERole.ADMIN },
          { value: ERole.TEACHER, label: ERole.TEACHER },
          { value: ERole.STUDENT, label: ERole.STUDENT },
        ]}
      />
    ) : (
      <Input />
    );

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
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface EditableTableProps<T> extends TableProps<T> {
  data: T[];
  columns: Array<TableColumnProps<T> & { editable?: boolean }>;
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

  const edit = (record: Partial<T> & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
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
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
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
        inputType: col.dataIndex === 'role' ? 'select' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
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

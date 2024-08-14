import { TableColumnProps, TableProps } from 'antd';

export interface EditableCellProps<T>
  extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: never;
  inputType: 'number' | 'text' | 'select';
  record: T;
  index: number;
}

export interface EditableTableProps<T> extends TableProps<T> {
  data: T[];
  columns: Array<TableColumnProps<T> & { editable?: boolean }>;
  onSave: (key: React.Key, row: T) => Promise<void>;
  onDelete: (key: React.Key) => void;
  editable?: boolean;
  deletable?: boolean;
}

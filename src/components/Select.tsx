'use client';

import { Select, SelectProps, Tag } from 'antd';

const SelectComp = ({ ...restProps }: SelectProps) => {
  return (
    <Select
      tagRender={(props) => {
        const { label, closable, onClose } = props;
        return (
          <Tag color="blue" closable={closable} onClose={onClose}>
            {label}
          </Tag>
        );
      }}
      {...restProps}
    />
  );
};

export default SelectComp;

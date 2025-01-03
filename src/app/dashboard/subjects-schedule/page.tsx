'use client';

import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const Page = () => {
  return (
    <>
      <div>
        <h1 className="mb-6 text-2xl font-extrabold text-gray-800">
          Daftar Mata Pelajaran
        </h1>
        <Button
          className="mb-6"
          icon={<PlusOutlined />}
          // onClick={() => showModalAddEdit('')}
          type="primary"
          size="large"
        >
          Tambah Jadwal Mata Pelajaran
        </Button>
      </div>
    </>
  );
};

export default Page;

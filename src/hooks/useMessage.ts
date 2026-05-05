import { App } from 'antd';

export const useMessage = () => {
  const { message } = App.useApp();
  return message;
};

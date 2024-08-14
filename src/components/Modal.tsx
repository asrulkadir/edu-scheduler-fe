import { Modal, ModalProps } from 'antd';

type TModalProps = ModalProps & {
  children: React.ReactNode;
};

const ModalComp: React.FC<TModalProps> = ({ children, ...props }) => {
  return <Modal {...props}>{children}</Modal>;
};

export default ModalComp;

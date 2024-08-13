import { Button, ButtonProps } from 'antd';
import React from 'react';

interface TButtonProps extends ButtonProps {
  title: string;
  color?: 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'primary';
};

const ButtonComp: React.FC<TButtonProps> = ({ title, className, color = 'primary', ...props }) => {
  const colorVariants = {
    primary: 'bg-primary-dark hover:bg-primary-light',
    secondary: 'bg-secondary-dark hover:bg-secondary-light',
    success: 'bg-success-dark hover:bg-success-light',
    warning: 'bg-warning-dark hover:bg-warning-light',
    danger: 'bg-danger-dark hover:bg-danger-light',
    info: 'bg-info-dark hover:bg-info-light',
  };
  return (
    <Button 
      size="large"
      className={`text-white ${colorVariants[color]} ${className}`}
      {...props}
    >
      {title}
    </Button>
  );
};

export default ButtonComp;
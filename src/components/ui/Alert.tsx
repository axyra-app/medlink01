import clsx from 'clsx';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ type, title, message, className = '' }) => {
  const alertConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-400',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-400',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
    },
  };

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className={clsx('rounded-lg border p-4', config.bgColor, config.borderColor, className)}>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <Icon className={clsx('h-5 w-5', config.iconColor)} />
        </div>
        <div className='ml-3'>
          {title && <h3 className={clsx('text-sm font-medium', config.textColor)}>{title}</h3>}
          <div className={clsx('text-sm', config.textColor)}>{message}</div>
        </div>
      </div>
    </div>
  );
};

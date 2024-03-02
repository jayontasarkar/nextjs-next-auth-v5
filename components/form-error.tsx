import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface IFormErrorProps {
  message?: string;
}

const FormError = ({ message }: IFormErrorProps) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <FaExclamationTriangle className="size-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;

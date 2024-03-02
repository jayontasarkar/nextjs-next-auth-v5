import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';

interface IFormSuccessProps {
  message?: string;
}

const FormSuccess = ({ message }: IFormSuccessProps) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <FaCircleCheck className="size-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;

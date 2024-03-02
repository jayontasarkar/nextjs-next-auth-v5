'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

interface ILoginButtonProps {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
}

const LoginButton = ({ children, mode, asChild }: ILoginButtonProps) => {
  const router = useRouter();

  const handleOnClick = () => {
    router.push('/auth/login');
  };

  if (mode === 'modal') {
    return <span>TODO: Implement modal</span>;
  }

  return (
    <span onClick={handleOnClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LoginButton;

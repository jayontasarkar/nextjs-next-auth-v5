'use client';

import React from 'react';
import { logout } from '@/actions/auth';

const LogoutButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="cursor-pointer" onClick={async () => await logout()}>
      {children}
    </span>
  );
};

export default LogoutButton;

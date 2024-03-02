import React from 'react';

interface IAuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: IAuthLayoutProps) => {
  return (
    <div className="h-full min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-sky-800">
      {children}
    </div>
  );
};

export default AuthLayout;

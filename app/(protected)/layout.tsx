import React from 'react';
import Navbar from './_components/Navbar';

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full pt-3 min-h-screen w-full flex flex-col gap-y-10 items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-sky-800">
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;

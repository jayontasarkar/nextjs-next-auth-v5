import { ExtendedUser } from '@/next-auth';
import { UserRole } from '@prisma/client';
import React from 'react';
import FormError from '../form-error';

const RoleGate = ({
  children,
  allowedRole,
  user,
}: {
  children: React.ReactNode;
  allowedRole: UserRole;
  user: ExtendedUser | null;
}) => {
  if (!user || user?.role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content" />
    );
  }
  return <div>{children}</div>;
};

export default RoleGate;

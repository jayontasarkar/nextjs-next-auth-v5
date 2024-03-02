"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const checkIsAdmin = async () => {
  const role: UserRole | undefined = await currentRole();
  if (role !== UserRole.ADMIN) {
    return { error: 'Forbidden' };
  }

  return { success: 'Allowed' };
};
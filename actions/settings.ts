"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserById } from "@/repositories/user";
import { TSettingsSchema } from "@/schemas";

export const updateSettings = async (
  values: TSettingsSchema
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const dbUser = await getUserById(user?.id as string);
  console.log('User', dbUser);
  console.log('Values', values);
  await db.user.update({
    where: { id: dbUser?.id },
    data: {
      ...values
    }
  });

  return {
    success: "Settings updated!"
  }
}
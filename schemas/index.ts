import { UserRole } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string({
    required_error: '"Email address is required"'
  }).email("Invalid email address format"),
  password: z.string({
    required_error: 'Password is required'
  }).min(6, {
    message: 'Password must be at least 6 characters'
  })
});

export const registerSchema = z.object({
  name: z.string({
    required_error: '"Name is required"'
  }).min(3, {
    message: 'Name must be at least 3 characters'
  }),
  email: z.string({
    required_error: '"Email address is required"'
  }).email("Invalid email address format"),
  password: z.string({
    required_error: 'Password is required'
  }).min(6, {
    message: 'Password must be at least 6 characters'
  })
});

export const resetSchema = z.object({
  email: z.string({
    required_error: '"Email address is required"'
  }).email("Invalid email address format")
});

export const passwordResetSchema = z.object({
  password: z.string({
    required_error: 'Password is required'
  }).min(6, {
    message: 'Password must be at least 6 characters'
  })
});

export const settingsSchema = z.object({
  name: z.optional(z.string()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
})
.refine((data) => {
  if (data.password && !data.newPassword) {
    return false;
  }

  return true;
}, {
  message: "New password is required!",
  path: ["newPassword"]
})
.refine((data) => {
  if (data.newPassword && !data.password) {
    return false;
  }

  return true;
}, {
  message: "Password is required!",
  path: ["password"]
});

export type TSettingsSchema = z.infer<typeof settingsSchema>;
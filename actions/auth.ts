'use server';

import bcrypt from 'bcryptjs';
import { TLoginSchema } from "@/components/auth/login-form";
import { loginSchema, passwordResetSchema, registerSchema, resetSchema } from "@/schemas";
import { signIn, signOut } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { TRegisterSchema } from "@/components/auth/register-form";
import { createUser, getPasswordResetTokenByToken, getUserByEmail, getVerificationTokenByToken } from "@/repositories/user";
import { generatePasswordResetToken, generateVerificationToken } from '@/lib/verificationTokens';
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/mail';
import { db } from '@/lib/db';
import { TResetSchema } from '@/components/auth/reset-form';
import { TResetPassword } from '@/components/auth/reset-password-form';

export const login = async (values: TLoginSchema) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid credentials!" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email address does not exist!" }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    await sendVerificationEmail(
      verificationToken.email, 
      verificationToken.token
    );
    return { success: "Confirmation email sent!" };
  }
  
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: 'Invalid credentials!'
          }
        default:
          return {
            error: "Something went wrong!"
          }
      }
    }
    throw error;
  }
};

export const register = async (values: TRegisterSchema) => {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email already in use!' }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await createUser({ name, email, password: hashedPassword });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    verificationToken.email, 
    verificationToken.token
  );

  return { success: "Confirmation email sent for verification!" };
};

export const logout = async () => {
  try {
    await signOut();
  } catch (error) {
    throw error;
  }
}

export const verifyVerificationToken = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { error: 'Token does not exist!' }
  }
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: 'Token has expired' };
  }
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: 'Token owner does not exist. Maybe changed user email.' }  
  }
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email
    }
  });
  await db.verificationToken.delete({
    where: { identifier: existingToken.identifier },
  });

  return {
    success: 'Email verified'
  }
};

export const resetPassword = async (data: TResetSchema) => {
  const validatedFields = resetSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: "Invalid email" };
  }
  const { email } =  validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: 'Email address not found' };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: 'Password reset link sent to your email.' };
};

export const resetNewPassword = async (
  values: TResetPassword,
  token?: string | null,
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = passwordResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Password updated!" };
};

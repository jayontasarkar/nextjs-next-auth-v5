import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from "next-auth"
import bcrypt from 'bcryptjs';
import { loginSchema } from './schemas';
import { getUserByEmail } from './repositories/user';

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;
          const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
          );
          if (isPasswordMatch) {
            return user;
          }
        }

        return null;
      }
    })
  ],
} satisfies NextAuthConfig
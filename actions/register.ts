'use server';

import bcrypt from 'bcryptjs';
import { TRegisterSchema } from "@/components/auth/register-form";
import { registerSchema } from "@/schemas";
import { createUser, getUserByEmail } from '@/repositories/user';


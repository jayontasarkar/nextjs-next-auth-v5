'use client';

import React, { useState, useTransition } from 'react';
import CardWrapper from './card-wrapper';
import { useForm } from 'react-hook-form';
import { loginSchema } from '@/schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import FormError from '../form-error';
import FormSuccess from '../form-success';
import { login } from '@/actions/auth';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export type TLoginSchema = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : '';

  const [isPending, startTransition] = useTransition();

  const [errorMsg, setErrorMsg] = useState<string | undefined>('');
  const [successMsg, setSuccessMsg] = useState<string | undefined>('');

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { handleSubmit, control } = form;

  const onSubmit = (data: TLoginSchema) => {
    setErrorMsg('');
    setSuccessMsg('');
    startTransition(async () => {
      try {
        const response = await login(data);
        setSuccessMsg(response?.success || '');
        setErrorMsg(response?.error || '');
      } catch (error: any) {
        console.log(error);
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              name="email"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="john@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              name="password"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="password"
                      {...field}
                      placeholder="******"
                    />
                  </FormControl>
                  <FormMessage />
                  <Button
                    size="sm"
                    variant="link"
                    asChild
                    className="px-0 font-normal"
                  >
                    <Link href="/auth/reset">Forgot password?</Link>
                  </Button>
                </FormItem>
              )}
            />
          </div>
          <FormError message={errorMsg || urlError} />
          <FormSuccess message={successMsg} />
          <Button type="submit" className="w-full" disabled={isPending}>
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;

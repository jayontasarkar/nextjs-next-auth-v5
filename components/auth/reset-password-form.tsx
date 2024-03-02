'use client';

import React, { useState, useTransition } from 'react';
import CardWrapper from './card-wrapper';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { z } from 'zod';
import error from 'next/error';
import FormError from '../form-error';
import FormSuccess from '../form-success';
import { Button } from '../ui/button';
import { passwordResetSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { useSearchParams } from 'next/navigation';
import { resetNewPassword } from '@/actions/auth';

export type TResetPassword = z.infer<typeof passwordResetSchema>;

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const [isPending, startTransition] = useTransition();
  const form = useForm<TResetPassword>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: '',
    },
  });
  const onSubmit = (formData: TResetPassword) => {
    setSuccess(undefined);
    setError(undefined);
    startTransition(async () => {
      try {
        const response = await resetNewPassword(formData, token);
        setSuccess(response?.success);
        setError(response?.error);
      } catch (error) {
        console.log(error);
        setError('Failed to reset password. Try again later');
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Reset your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetPasswordForm;

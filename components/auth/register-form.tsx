'use client';

import React, { useState, useTransition } from 'react';
import CardWrapper from './card-wrapper';
import { useForm } from 'react-hook-form';
import { registerSchema } from '@/schemas';
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
import { register } from '@/actions/auth';

export type TRegisterSchema = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();

  const [errorMsg, setErrorMsg] = useState<string | undefined>('');
  const [successMsg, setSuccessMsg] = useState<string | undefined>('');

  const form = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  const { handleSubmit, control } = form;

  const onSubmit = (data: TRegisterSchema) => {
    setErrorMsg('');
    setSuccessMsg('');
    startTransition(async () => {
      try {
        const response = await register(data);
        setSuccessMsg(response?.success);
        setErrorMsg(response?.error);
      } catch (error: any) {
        console.log(error);
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              name="name"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="John Doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                </FormItem>
              )}
            />
          </div>
          {errorMsg && <FormError message={errorMsg} />}
          {successMsg && <FormSuccess message={successMsg} />}
          <Button type="submit" className="w-full" disabled={isPending}>
            Create an account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;

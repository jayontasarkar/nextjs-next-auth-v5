'use client';

import React, { useCallback, useEffect, useState } from 'react';
import CardWrapper from './card-wrapper';
import { BeatLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { verifyVerificationToken } from '@/actions/auth';
import FormSuccess from '../form-success';
import FormError from '../form-error';

const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError('Verification token not found!');
      return;
    }

    setSuccess(undefined);
    setError(undefined);
    verifyVerificationToken(token)
      .then((data) => {
        setSuccess(data?.success);
        setError(data?.error);
      })
      .catch((err) => {
        setError('Failed verifying token.');
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {error || success ? (
          <>
            <FormSuccess message={success} />
            <FormError message={error} />
          </>
        ) : (
          <BeatLoader />
        )}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;

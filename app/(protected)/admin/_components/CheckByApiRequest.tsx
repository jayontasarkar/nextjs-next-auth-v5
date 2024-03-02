'use client';

import { Button } from '@/components/ui/button';

const CheckByApiRequest = () => {
  const onSApiRequestClick = async () => {
    try {
      const response = await fetch('/api/admin', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response', response);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        console.log('Forbidden');
      } else {
        console.log('Server Error:', error);
      }
    }
  };

  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
      <p className="text-sm font-medium">Admin-only API Request</p>
      <Button onClick={onSApiRequestClick}>Click to test</Button>
    </div>
  );
};

export default CheckByApiRequest;

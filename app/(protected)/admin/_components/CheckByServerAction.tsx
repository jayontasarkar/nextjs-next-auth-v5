'use client';

import { checkIsAdmin } from '@/actions/admin';
import { Button } from '@/components/ui/button';

const CheckByServerAction = () => {
  const onServerActionClick = async () => {
    try {
      const response = await checkIsAdmin();
      if (response?.success) {
        console.log('Success', response);
      } else {
        console.log('Forbidden', response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
      <p className="text-sm font-medium">Admin-only Server Action</p>
      <Button onClick={onServerActionClick}>Click to test</Button>
    </div>
  );
};

export default CheckByServerAction;

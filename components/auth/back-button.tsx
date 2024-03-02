'use client';

import Link from 'next/link';
import { Button } from '../ui/button';

interface TBackButtonProps {
  label: string;
  href: string;
}

const BackButton = ({ label, href }: TBackButtonProps) => {
  return (
    <Button variant="link" className="font-normal w-full" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default BackButton;

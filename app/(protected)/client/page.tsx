import { auth } from '@/auth';
import { UserInfo } from '@/components/user-info';
import { ExtendedUser } from '@/next-auth';
import { Session } from 'next-auth';

const ClientPage = async () => {
  const session: Session | null = await auth();

  return <UserInfo label="📱 Client component" user={session?.user} />;
};

export default ClientPage;

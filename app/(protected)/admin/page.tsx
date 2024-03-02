import { auth } from '@/auth';
import RoleGate from '@/components/auth/role-gate';
import FormSuccess from '@/components/form-success';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { UserRole } from '@prisma/client';
import { Session } from 'next-auth';
import CheckByApiRequest from './_components/CheckByApiRequest';
import CheckByServerAction from './_components/CheckByServerAction';

const AdminPage = async () => {
  const session: Session | null = await auth();
  const user = session?.user || null;

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🔑 Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN} user={user}>
          <FormSuccess message="You are allowed to see this content" />
        </RoleGate>
        <CheckByServerAction />
        <CheckByApiRequest />
      </CardContent>
    </Card>
  );
};

export default AdminPage;

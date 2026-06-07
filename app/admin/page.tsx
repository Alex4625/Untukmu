import AdminClient from '@/components/AdminClient';
import { isAdminRequest } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  return <AdminClient authenticated={await isAdminRequest()} />;
}

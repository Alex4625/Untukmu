import AdminClient from '@/components/AdminClient';
import { isAdminRequest } from '@/lib/adminAuth';
import { getAdminContent } from '@/lib/adminContent';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const authenticated = await isAdminRequest();
  if (!authenticated) return <AdminClient authenticated={false} />;

  let initialData = null;
  let initialError = '';
  try {
    initialData = await getAdminContent();
  } catch (error) {
    initialError = error instanceof Error ? error.message : 'Gagal memuat data admin.';
  }

  return <AdminClient authenticated initialData={initialData} initialError={initialError} />;
}

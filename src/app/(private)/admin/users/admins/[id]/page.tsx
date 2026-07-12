import { AdminProfileDetail } from '../_components/admin-profile';

export default async function AdminDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AdminProfileDetail adminId={id} />;
}

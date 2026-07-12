import { ParentProfile } from './_components/parent-profile';

export default async function ParentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ParentProfile parentId={id} />;
}

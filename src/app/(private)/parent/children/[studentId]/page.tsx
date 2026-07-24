import { ChildDetail } from './_components/child-detail';

export default async function ChildDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  return <ChildDetail studentId={studentId} />;
}

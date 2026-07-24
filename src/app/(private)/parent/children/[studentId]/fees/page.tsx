import { FeesView } from './_components/fees-view';

export default async function ChildFeesPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  return <FeesView studentId={studentId} />;
}
